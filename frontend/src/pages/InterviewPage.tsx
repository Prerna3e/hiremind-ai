import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, CheckCircle, ChevronRight, BrainCircuit, User, Volume2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InterviewPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<'setup' | 'interview' | 'feedback'>('setup');
    const [loading, setLoading] = useState(false);

    // Setup state
    const [role, setRole] = useState('Full Stack Developer');
    const [experience, setExperience] = useState('Intermediate');
    const [techStack, setTechStack] = useState('');
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Interview state
    const [interviewData, setInterviewData] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [chatHistory, setChatHistory] = useState<{ type: 'ai' | 'user', text: string }[]>([]);

    // Feedback state
    const [evaluation, setEvaluation] = useState<any>(null);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const englishVoices = voices.filter(v => v.lang.startsWith('en'));
            setAvailableVoices(englishVoices);

            // Set default
            const defaultVoice = englishVoices.find(v => v.name.includes('Google US English') || v.lang === 'en-US') || englishVoices[0];
            if (defaultVoice && !selectedVoice) setSelectedVoice(defaultVoice.name);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, [selectedVoice]);

    const speak = useCallback((text: string) => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
    }, [availableVoices, selectedVoice]);

    const handleStartSetup = async () => {
        setLoading(true);
        try {
            const token = user?.token;
            const res = await axios.post('http://localhost:5000/api/interviews/start', {
                role,
                experienceLevel: experience,
                techStack: techStack.split(',').map(s => s.trim()),
                interviewType: 'Technical'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setInterviewData(res.data);
            const initialMsg = `Welcome! I'm your interviewer today. We'll be discussing your experience with ${techStack}. Here is your first question: \n\n ${res.data.questions[0].question}`;
            setChatHistory([{ type: 'ai', text: initialMsg }]);
            speak(initialMsg);
            setStep('interview');
        } catch (err) {
            alert('Failed to start interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) return;

        const currentAnswer = answer;
        setAnswer('');
        setChatHistory(prev => [...prev, { type: 'user', text: currentAnswer }]);
        setLoading(true);

        try {
            const token = user?.token;
            await axios.post('http://localhost:5000/api/interviews/submit', {
                interviewId: interviewData._id,
                questionIndex: currentQuestionIndex,
                answer: currentAnswer
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < interviewData.questions.length) {
                setCurrentQuestionIndex(nextIndex);
                const nextQuestion = interviewData.questions[nextIndex].question;
                setChatHistory(prev => [...prev, { type: 'ai', text: nextQuestion }]);
                speak(nextQuestion);
            } else {
                handleFinishInterview();
            }
        } catch (err) {
            alert('Error submitting answer.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinishInterview = async () => {
        setLoading(true);
        const closingMsg = "Thank you for your responses. I'm analyzing your performance now... Please wait.";
        setChatHistory(prev => [...prev, { type: 'ai', text: closingMsg }]);
        speak(closingMsg);
        try {
            const token = user?.token;
            const res = await axios.post(`http://localhost:5000/api/interviews/evaluate/${interviewData._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvaluation(res.data.evaluation);
            setStep('feedback');
        } catch (err) {
            alert('Error fetching evaluation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                <AnimatePresence mode="wait">
                    {step === 'setup' && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="glass"
                            style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', width: '100%' }}
                        >
                            <h2 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Interview Setup</h2>
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '32px' }}>Tailor your interview experience</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Job Role</label>
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g. React Developer"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Experience Level</label>
                                    <select
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        style={{ width: '100%', padding: '12px', background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '8px' }}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Senior</option>
                                        <option>Lead</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Tech Stack (comma separated)</label>
                                    <input
                                        type="text"
                                        value={techStack}
                                        onChange={(e) => setTechStack(e.target.value)}
                                        placeholder="e.g. React, Node.js, Typescript"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Volume2 size={18} color="var(--color-primary)" />
                                        <span>AI Interviewer Accent / Voice</span>
                                    </label>
                                    <select
                                        value={selectedVoice}
                                        onChange={(e) => setSelectedVoice(e.target.value)}
                                        style={{ width: '100%', padding: '12px', background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '8px' }}
                                    >
                                        <optgroup label="Popular Accents">
                                            {availableVoices
                                                .filter(v => ['en-IN', 'en-AU', 'en-GB', 'en-US'].includes(v.lang))
                                                .map(v => (
                                                    <option key={v.name} value={v.name}>
                                                        {v.name.includes('India') ? '🇮🇳 Indian Accent' :
                                                            v.name.includes('Australia') ? '🇦🇺 Australian Accent' :
                                                                v.name.includes('Great Britain') || v.name.includes('UK') ? '🇬🇧 British Accent' :
                                                                    '🇺🇸 American Accent'} ({v.name})
                                                    </option>
                                                ))
                                            }
                                        </optgroup>
                                        <optgroup label="Other English Voices">
                                            {availableVoices
                                                .filter(v => !['en-IN', 'en-AU', 'en-GB', 'en-US'].includes(v.lang))
                                                .map(v => (
                                                    <option key={v.name} value={v.name}>{v.name}</option>
                                                ))
                                            }
                                        </optgroup>
                                    </select>
                                </div>

                                <button
                                    className="btn-primary"
                                    onClick={handleStartSetup}
                                    disabled={loading || !techStack}
                                    style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '54px' }}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            <Sparkles size={20} />
                                            <span>Start Interview Now</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'interview' && (
                        <motion.div
                            key="interview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1 }}
                        >
                            <div className="glass" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <BrainCircuit color="var(--color-primary)" />
                                    <div>
                                        <h3 style={{ fontSize: '1rem' }}>{role} Interview</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Question {currentQuestionIndex + 1} of 5</p>
                                    </div>
                                </div>
                                <div style={{ height: '8px', width: '200px', background: 'var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.3s' }}></div>
                                </div>
                            </div>

                            <div className="glass" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '500px' }}>
                                {chatHistory.map((chat, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: chat.type === 'ai' ? 'flex-start' : 'flex-end', alignItems: 'flex-end', gap: '12px' }}>
                                        {chat.type === 'ai' && <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={16} color="white" /></div>}
                                        <div style={{
                                            maxWidth: '80%',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            background: chat.type === 'ai' ? 'var(--color-card)' : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                            border: chat.type === 'ai' ? '1px solid var(--color-border)' : 'none',
                                            color: 'white',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.5,
                                            boxShadow: chat.type === 'user' ? '0 4px 15px rgba(56, 189, 248, 0.2)' : 'none'
                                        }}>
                                            {chat.text}
                                        </div>
                                        {chat.type === 'user' && <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}><User size={16} /></div>}
                                    </div>
                                ))}
                                {loading && chatHistory[chatHistory.length - 1].type === 'user' && (
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={16} color="white" /></div>
                                        <div className="glass" style={{ padding: '12px 20px', borderRadius: '16px' }}>
                                            <Loader2 className="animate-spin" size={20} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ position: 'relative' }}>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    style={{ width: '100%', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', paddingRight: '80px', color: 'white', resize: 'none', height: '120px', fontSize: '1rem' }}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }}
                                />
                                <button
                                    onClick={handleSubmitAnswer}
                                    disabled={loading || !answer.trim()}
                                    style={{ position: 'absolute', right: '16px', bottom: '16px', width: '56px', height: '56px', borderRadius: '12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: (loading || !answer.trim()) ? 0.5 : 1 }}
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'feedback' && evaluation && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass"
                            style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px', width: '100%' }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                                <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px' }}>
                                    <CheckCircle size={48} />
                                </div>
                                <h1 style={{ fontSize: '3rem', marginBottom: '12px' }}>Interview Complete!</h1>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>Here is your comprehensive evaluation</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                                {[
                                    { label: 'Technical Score', value: evaluation.technicalScore, color: '#38bdf8' },
                                    { label: 'Communication', value: evaluation.communicationScore, color: '#818cf8' },
                                    { label: 'Confidence', value: evaluation.confidenceScore, color: '#f59e0b' },
                                    { label: 'Overall', value: evaluation.overallScore, color: '#10b981' }
                                ].map((stat, i) => (
                                    <div key={i} className="glass" style={{ padding: '24px', textAlign: 'center', borderBottom: `4px solid ${stat.color}` }}>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{stat.label}</p>
                                        <p style={{ fontSize: '2.5rem', fontWeight: '800', color: stat.color }}>{stat.value}%</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '48px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Sparkles color="#f59e0b" /> Strengths
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {evaluation.strengths.map((s: string, i: number) => (
                                            <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', color: '#a7f3d0' }}>
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <ChevronRight color="#ef4444" /> Areas of Improvement
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {evaluation.weaknesses.map((w: string, i: number) => (
                                            <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                                                {w}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="glass" style={{ padding: '32px', marginBottom: '48px', background: 'rgba(56, 189, 248, 0.05)' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Executive Summary</h3>
                                <p style={{ lineHeight: 1.8, color: 'var(--color-text-muted)' }}>{evaluation.summary}</p>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
                                    Back to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InterviewPage;
