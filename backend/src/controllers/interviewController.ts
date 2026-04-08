import { Request, Response } from 'express';
import Interview from '../models/Interview.js';
import OpenAI from 'openai';
import { buildInterviewPrompt, buildEvaluationPrompt } from '../utils/prompts.js';
import User from '../models/User.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ═══════════════════════════════════════════════════════════
// START INTERVIEW — Create session + generate first question
// ═══════════════════════════════════════════════════════════

const startInterview = async (req: any, res: Response) => {
    const {
        role,
        experienceLevel,
        techStack,
        interviewType = 'mixed',
        numberOfQuestions = 10,
        difficulty = 'medium',
    } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const candidateName = user?.name || 'Candidate';

        // Parse techStack — accept string or array
        const stackArray = Array.isArray(techStack)
            ? techStack
            : typeof techStack === 'string'
              ? techStack.split(',').map((s: string) => s.trim()).filter(Boolean)
              : [];

        // Generate the first question via AI
        const prompt = buildInterviewPrompt(
            candidateName,
            role,
            stackArray,
            experienceLevel,
            interviewType,
            difficulty,
            numberOfQuestions,
            1
        );

        let firstQuestion = `Hi ${candidateName}! I'm Maya, your interviewer today. Great to have you here. Let's start — can you walk me through your background and what brought you to this role?`;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: `[Interview starting. This is the first message. Generate a warm greeting and the first question for ${candidateName} applying for ${role}.]` }
                ],
                model: 'gpt-4o',
                response_format: { type: 'json_object' },
            });

            const parsed = JSON.parse(completion.choices[0].message.content || '{}');
            if (parsed.next_question) {
                firstQuestion = parsed.next_question;
            }
        } catch (aiErr: any) {
            console.warn('AI first question generation failed, using fallback:', aiErr.message);
        }

        // Create the interview record
        const interview = await Interview.create({
            user: req.user._id,
            role,
            experienceLevel,
            techStack: stackArray,
            interviewType,
            numberOfQuestions,
            difficulty,
            currentQuestionIndex: 0,
            scores: { technical: 50, communication: 50, confidence: 50 },
            status: 'in_progress',
            questions: [{
                question: firstQuestion,
                answer: '',
                feedback: { positive: '', improvement: '' },
                scoreDelta: { technical: 0, communication: 0, confidence: 0 },
                score: 0,
            }],
        });

        res.status(201).json({
            interviewId: interview._id,
            currentQuestion: firstQuestion,
            questionNumber: 1,
            totalQuestions: numberOfQuestions,
            scores: interview.scores,
        });
    } catch (error: any) {
        console.error('Start interview error:', error.message);
        res.status(500).json({ message: 'Failed to start interview session.' });
    }
};

// ═══════════════════════════════════════════════════════════
// SUBMIT ANSWER — Process answer, get feedback + next question
// ═══════════════════════════════════════════════════════════

const submitAnswer = async (req: any, res: Response) => {
    const { interviewId, answer } = req.body;

    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) return res.status(404).json({ message: 'Interview session not found.' });

        const user = await User.findById(req.user._id);
        const candidateName = user?.name || 'Candidate';
        const currentIdx = interview.currentQuestionIndex || 0;
        const questionNumber = currentIdx + 1;
        const isLastQuestion = questionNumber >= interview.numberOfQuestions;

        // Save the answer to current question
        if (interview.questions[currentIdx]) {
            interview.questions[currentIdx].answer = answer;
        }

        // Build conversation context
        const context: Array<{ role: 'assistant' | 'user'; content: string }> = [];
        for (const q of interview.questions) {
            if (q.question) context.push({ role: 'assistant', content: q.question });
            if (q.answer) context.push({ role: 'user', content: q.answer });
        }

        // Build the prompt for the next question
        const prompt = buildInterviewPrompt(
            candidateName,
            interview.role || '',
            interview.techStack || [],
            interview.experienceLevel || '',
            interview.interviewType || 'mixed',
            interview.difficulty || 'medium',
            interview.numberOfQuestions,
            questionNumber + 1
        );

        let aiResponse = {
            next_question: "That's a great point. Moving on — can you tell me about a challenging project you've worked on recently?",
            feedback_on_last_answer: {
                positive: "You provided a clear and structured response.",
                improvement: "Try to include more specific metrics or outcomes.",
                score_delta: { technical: 3, communication: 2, confidence: 2 },
            },
            is_interview_complete: isLastQuestion,
        };

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: prompt },
                    ...context,
                ],
                model: 'gpt-4o',
                response_format: { type: 'json_object' },
            });

            const parsed = JSON.parse(completion.choices[0].message.content || '{}');

            // Validate and sanitize the AI response
            if (parsed.next_question) aiResponse.next_question = parsed.next_question;
            if (parsed.feedback_on_last_answer) {
                aiResponse.feedback_on_last_answer = {
                    positive: parsed.feedback_on_last_answer.positive || aiResponse.feedback_on_last_answer.positive,
                    improvement: parsed.feedback_on_last_answer.improvement || aiResponse.feedback_on_last_answer.improvement,
                    score_delta: {
                        technical: clampDelta(parsed.feedback_on_last_answer.score_delta?.technical),
                        communication: clampDelta(parsed.feedback_on_last_answer.score_delta?.communication),
                        confidence: clampDelta(parsed.feedback_on_last_answer.score_delta?.confidence),
                    },
                };
            }
            if (typeof parsed.is_interview_complete === 'boolean') {
                aiResponse.is_interview_complete = parsed.is_interview_complete;
            }

            // Force completion if we've hit the question limit
            if (isLastQuestion) {
                aiResponse.is_interview_complete = true;
            }
        } catch (aiErr: any) {
            console.error('AI response error:', aiErr.message);
            // Use fallback response defined above
        }

        const { score_delta } = aiResponse.feedback_on_last_answer;

        // Update the current question with feedback
        if (interview.questions[currentIdx]) {
            interview.questions[currentIdx].feedback = {
                positive: aiResponse.feedback_on_last_answer.positive,
                improvement: aiResponse.feedback_on_last_answer.improvement,
            };
            interview.questions[currentIdx].scoreDelta = score_delta;
        }

        // Update running scores (clamped 0-100)
        const scores = interview.scores || { technical: 50, communication: 50, confidence: 50 };
        scores.technical = clampScore(scores.technical + score_delta.technical);
        scores.communication = clampScore(scores.communication + score_delta.communication);
        scores.confidence = clampScore(scores.confidence + score_delta.confidence);
        interview.scores = scores;

        // Add next question if interview is not complete
        if (!aiResponse.is_interview_complete) {
            interview.questions.push({
                question: aiResponse.next_question,
                answer: '',
                feedback: { positive: '', improvement: '' },
                scoreDelta: { technical: 0, communication: 0, confidence: 0 },
                score: 0,
            });
            interview.currentQuestionIndex = currentIdx + 1;
        } else {
            interview.status = 'completed';
        }

        await interview.save();

        res.status(200).json({
            feedback: aiResponse.feedback_on_last_answer,
            nextQuestion: aiResponse.is_interview_complete ? null : aiResponse.next_question,
            questionNumber: aiResponse.is_interview_complete ? questionNumber : questionNumber + 1,
            totalQuestions: interview.numberOfQuestions,
            scores,
            scoreDelta: score_delta,
            isFinished: aiResponse.is_interview_complete,
        });
    } catch (error: any) {
        console.error('Submit answer error:', error.message);
        res.status(500).json({ message: 'Failed to process answer.' });
    }
};

// ═══════════════════════════════════════════════════════════
// EVALUATE INTERVIEW — Generate final report with SWOT
// ═══════════════════════════════════════════════════════════

const evaluateInterview = async (req: any, res: Response) => {
    const { interviewId } = req.params;

    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) return res.status(404).json({ message: 'Interview session not found.' });

        // Build transcript
        const transcript = interview.questions
            .map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${q.answer || '[No answer provided]'}`)
            .join('\n\n');

        const evalPrompt = buildEvaluationPrompt(
            interview.role || 'Software Engineer',
            interview.experienceLevel || 'Mid',
            transcript
        );

        let evaluation: any = {
            communicationScore: interview.scores?.communication || 50,
            technicalScore: interview.scores?.technical || 50,
            confidenceScore: interview.scores?.confidence || 50,
            overallScore: Math.round(
                ((interview.scores?.technical || 50) * 0.4) +
                ((interview.scores?.communication || 50) * 0.3) +
                ((interview.scores?.confidence || 50) * 0.3)
            ),
            strengths: ['Completed the full interview', 'Attempted all questions'],
            weaknesses: ['Could provide more specific examples'],
            opportunities: ['Deep-dive into system design', 'Practice behavioral questions'],
            threats: ['May struggle with advanced topics under pressure'],
            topDoneWell: ['Showed enthusiasm', 'Communicated ideas clearly', 'Good problem-solving approach'],
            topToImprove: ['Add more technical depth', 'Use STAR method for behavioral answers', 'Practice time management'],
            suggestedResources: ['System Design Interview by Alex Xu', 'LeetCode Top 150', 'Cracking the Coding Interview'],
            summary: 'The candidate showed potential but needs more preparation in key areas.',
        };

        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'system', content: evalPrompt }],
                model: 'gpt-4o',
                response_format: { type: 'json_object' },
            });

            const parsed = JSON.parse(completion.choices[0].message.content || '{}');
            evaluation = { ...evaluation, ...parsed };
        } catch (aiErr: any) {
            console.error('Evaluation AI error:', aiErr.message);
            // Use fallback evaluation above
        }

        interview.evaluation = evaluation;
        interview.status = 'completed';
        await interview.save();

        res.status(200).json({ evaluation });
    } catch (error: any) {
        console.error('Evaluate interview error:', error.message);
        res.status(500).json({ message: 'Failed to generate evaluation.' });
    }
};

// ═══════════════════════════════════════════════════════════
// GET INTERVIEWS — Fetch user's interview history
// ═══════════════════════════════════════════════════════════

const getInterviews = async (req: any, res: Response) => {
    try {
        const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(interviews);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch interview history.' });
    }
};

// ═══════════════════════════════════════════════════════════
// GET ALL CANDIDATES — Admin/recruiter view
// ═══════════════════════════════════════════════════════════

const getAllCandidates = async (req: any, res: Response) => {
    try {
        const interviews = await Interview.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(interviews);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch candidates.' });
    }
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function clampDelta(val: any): number {
    const n = typeof val === 'number' ? val : 0;
    return Math.max(-10, Math.min(15, n));
}

function clampScore(val: number): number {
    return Math.max(0, Math.min(100, Math.round(val)));
}

export { startInterview, submitAnswer, evaluateInterview, getInterviews, getAllCandidates };
