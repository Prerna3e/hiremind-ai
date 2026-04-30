import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface InterviewSetupData {
    role: string;
    experienceLevel: string;
    techStack: string;
    interviewType: 'technical' | 'hr' | 'mixed';
    numberOfQuestions: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Scores {
    technical: number;
    communication: number;
    confidence: number;
}

export interface ScoreDelta {
    technical: number;
    communication: number;
    confidence: number;
}

export interface Feedback {
    positive: string;
    improvement: string;
    score_delta: ScoreDelta;
}

export interface Evaluation {
    communicationScore: number;
    technicalScore: number;
    confidenceScore: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    topDoneWell: string[];
    topToImprove: string[];
    suggestedResources: string[];
    summary: string;
}

export type InterviewPhase = 'setup' | 'interview' | 'summary';

export interface UseInterviewReturn {
    phase: InterviewPhase;
    interviewId: string | null;
    currentQuestion: string;
    questionNumber: number;
    totalQuestions: number;
    scores: Scores;
    lastScoreDelta: ScoreDelta | null;
    lastFeedback: Feedback | null;
    evaluation: Evaluation | null;
    loading: boolean;
    error: string | null;
    showFeedback: boolean;
    setupData: InterviewSetupData;
    setSetupData: React.Dispatch<React.SetStateAction<InterviewSetupData>>;
    verdict: string | null;
    sentiment: string;
    startInterview: () => Promise<void>;
    submitAnswer: (answer: string) => Promise<void>;
    proceedToNextQuestion: () => void;
    finishInterview: () => Promise<void>;
    resetInterview: () => void;
    retryInterview: () => void;
    dismissError: () => void;
}

// ═══════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════

export const useInterview = (): UseInterviewReturn => {
    const [phase, setPhase] = useState<InterviewPhase>('setup');
    const [interviewId, setInterviewId] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [nextQuestionBuffer, setNextQuestionBuffer] = useState('');
    const [questionNumber, setQuestionNumber] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [scores, setScores] = useState<Scores>({ technical: 50, communication: 50, confidence: 50 });
    const [lastScoreDelta, setLastScoreDelta] = useState<ScoreDelta | null>(null);
    const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [verdict, setVerdict] = useState<string | null>(null);
    const [sentiment, setSentiment] = useState<string>('Initializing...');

    const [setupData, setSetupData] = useState<InterviewSetupData>({
        role: '',
        experienceLevel: '',
        techStack: '',
        interviewType: 'mixed',
        numberOfQuestions: 10,
        difficulty: 'medium',
    });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    // ─── START INTERVIEW ──────────────────
    const startInterview = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("Sending start interview request with data:", {
                role: setupData.role,
                experienceLevel: setupData.experienceLevel,
                techStack: setupData.interviewType === 'hr' ? '' : setupData.techStack,
                interviewType: setupData.interviewType,
                numberOfQuestions: setupData.numberOfQuestions,
                difficulty: setupData.difficulty,
            });

            const res = await axios.post(
                `${API_BASE_URL}/interviews/start`,
                {
                    role: setupData.role,
                    experienceLevel: setupData.experienceLevel,
                    techStack: setupData.interviewType === 'hr' ? '' : setupData.techStack, // Default to empty for HR
                    interviewType: setupData.interviewType,
                    numberOfQuestions: setupData.numberOfQuestions,
                    difficulty: setupData.difficulty,
                },
                getAuthHeaders()
            );

            console.log("Start interview response:", res.data);

            setInterviewId(res.data.interviewId);
            // Support both questions array and single currentQuestion field
            const initialQuestion = res.data.questions ? res.data.questions[0] : res.data.currentQuestion;
            setCurrentQuestion(initialQuestion);
            setQuestionNumber(res.data.questionNumber);
            setTotalQuestions(res.data.totalQuestions);
            setScores(res.data.scores);
            setPhase('interview');
            setIsFinished(false);
        } catch (err: any) {
            console.error("Start interview failed:", err);
            if (err.response?.status === 401) {
                console.warn("Unauthorized! Redirecting to login...");
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            setError(err.response?.data?.message || 'Failed to start interview. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [setupData]);

    // ─── SUBMIT ANSWER ────────────────────
    const submitAnswer = useCallback(async (answer: string) => {
        if (!interviewId || loading || !answer.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/interviews/submit`,
                { interviewId, answer },
                getAuthHeaders()
            );

            const { feedback, verdict: v, nextQuestion, questionNumber: qn, totalQuestions: tq, scores: newScores, scoreDelta, isFinished: done } = res.data;

            // Show feedback first
            setLastFeedback(feedback);
            setLastScoreDelta(scoreDelta);
            setScores(newScores);
            setVerdict(v);
            setShowFeedback(true);

            // Buffer the next question
            if (nextQuestion) {
                setNextQuestionBuffer(nextQuestion);
                setQuestionNumber(qn);
                setTotalQuestions(tq);
                setSentiment(res.data.sentiment || 'Observing...');
            }

            if (done) {
                setIsFinished(true);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [interviewId, loading]);

    // ─── PROCEED TO NEXT QUESTION ─────────
    const proceedToNextQuestion = useCallback(() => {
        setShowFeedback(false);

        if (isFinished) {
            finishInterview();
            return;
        }

        if (nextQuestionBuffer) {
            setCurrentQuestion(nextQuestionBuffer);
            setNextQuestionBuffer('');
        }

        setLastFeedback(null);
        setLastScoreDelta(null);
    }, [nextQuestionBuffer, isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── FINISH INTERVIEW ─────────────────
    const finishInterview = useCallback(async () => {
        if (!interviewId) return;

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/interviews/evaluate/${interviewId}`,
                {},
                getAuthHeaders()
            );

            setEvaluation(res.data.evaluation);
            setPhase('summary');
        } catch (err: any) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            setError(err.response?.data?.message || 'Failed to generate evaluation. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [interviewId]);

    // ─── RESET ────────────────────────────
    const resetInterview = useCallback(() => {
        setPhase('setup');
        setInterviewId(null);
        setCurrentQuestion('');
        setNextQuestionBuffer('');
        setQuestionNumber(0);
        setTotalQuestions(10);
        setScores({ technical: 50, communication: 50, confidence: 50 });
        setLastScoreDelta(null);
        setLastFeedback(null);
        setEvaluation(null);
        setLoading(false);
        setError(null);
        setShowFeedback(false);
        setIsFinished(false);
        setVerdict(null);
    }, []);

    // ─── RETRY (same settings) ────────────
    const retryInterview = useCallback(() => {
        resetInterview();
        // Keep the same setup data
    }, [resetInterview]);

    const dismissError = useCallback(() => {
        setError(null);
    }, []);

    return {
        phase,
        interviewId,
        currentQuestion,
        questionNumber,
        totalQuestions,
        scores,
        lastScoreDelta,
        lastFeedback,
        evaluation,
        loading,
        error,
        showFeedback,
        setupData,
        setSetupData,
        verdict,
        sentiment,
        startInterview,
        submitAnswer,
        proceedToNextQuestion,
        finishInterview,
        resetInterview,
        retryInterview,
        dismissError,
    };
};
