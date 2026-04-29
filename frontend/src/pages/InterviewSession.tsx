import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Mic, MicOff, Volume2, VolumeX,
    ChevronRight, Sparkles, AlertCircle,
    ThumbsUp, Lightbulb, Clock, Code as CodeIcon,
    Maximize2, Play, Terminal, TrendingUp, TrendingDown, Activity, BrainCircuit
} from 'lucide-react';
import type { Scores, ScoreDelta, Feedback } from '../hooks/useInterview';
import FuturisticLayout from '../components/FuturisticLayout';
import robotAvatar from '../assets/robot-avatar.png';

interface InterviewSessionProps {
    currentQuestion: string;
    questionNumber: number;
    totalQuestions: number;
    scores: Scores;
    lastScoreDelta: ScoreDelta | null;
    lastFeedback: Feedback | null;
    showFeedback: boolean;
    loading: boolean;
    error: string | null;
    onSubmitAnswer: (answer: string) => Promise<void>;
    onProceedToNext: () => void;
    onDismissError: () => void;
    // Voice
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string) => void;
    stopSpeaking: () => void;
    resetTranscript: () => void;
    voiceSupported: boolean;
    setupData: { role: string; interviewType: string; techStack?: string; difficulty?: string };
    verdict: string | null;
    sentiment: string;
}

// ═══════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════

const GlowingScoreBar = ({ label, value, color, delta }: {
    label: string; value: number; color: string; delta: number | null;
}) => (
    <div style={{ marginBottom: '22px' }}>
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '10px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-futuristic)' }}>
                    {label}
                </span>
                {delta !== null && delta !== 0 && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        style={{ 
                            color: delta > 0 ? '#22c55e' : '#ef4444', 
                            fontSize: '0.75rem', fontWeight: 900, 
                            display: 'flex', alignItems: 'center', gap: '2px',
                            background: delta > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '1px 6px', borderRadius: '4px'
                        }}
                    >
                        {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(delta)}
                    </motion.div>
                )}
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-mono)' }}>
                {value}%
            </span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                style={{ height: '100%', background: color, boxShadow: `0 0 20px ${color}88` }}
            />
        </div>
    </div>
);

const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            <Clock size={16} />
            <span>{formatTime(seconds)}</span>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// MAIN SESSION COMPONENT
// ═══════════════════════════════════════════════════════════

const InterviewSession: React.FC<InterviewSessionProps> = (props) => {
    const {
        currentQuestion, questionNumber, totalQuestions, scores, lastScoreDelta,
        lastFeedback, showFeedback, loading, error, onSubmitAnswer, onProceedToNext,
        onDismissError, isListening, isSpeaking, transcript, startListening,
        stopListening, speak, stopSpeaking, resetTranscript, voiceSupported, setupData, verdict, sentiment,
    } = props;

    const [typedAnswer, setTypedAnswer] = useState('');
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [showCode, setShowCode] = useState(false);
    const hasSpokenRef = useRef('');

    useEffect(() => {
        if (currentQuestion && voiceEnabled && currentQuestion !== hasSpokenRef.current) {
            hasSpokenRef.current = currentQuestion;
            speak(currentQuestion);
        }
    }, [currentQuestion, voiceEnabled, speak]);

    useEffect(() => {
        if (transcript) setTypedAnswer(transcript);
    }, [transcript]);

    const handleSubmit = async () => {
        const answer = typedAnswer.trim();
        if (!answer || loading) return;
        await onSubmitAnswer(answer);
        setTypedAnswer('');
        resetTranscript();
    };

    const overallScore = Math.round(scores.technical * 0.4 + scores.communication * 0.3 + scores.confidence * 0.3);

    return (
        <FuturisticLayout>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                
                {/* Header Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '5px' }}>INTERVIEW TYPE</div>
                            <div style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-futuristic)', fontSize: '0.9rem' }}>{setupData.interviewType.toUpperCase()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '5px' }}>TARGET ROLE</div>
                            <div style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-futuristic)', fontSize: '0.9rem' }}>{setupData.role.toUpperCase()}</div>
                        </div>
                        {setupData.interviewType !== 'hr' && setupData.techStack && (
                            <div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '5px' }}>TECH STACK</div>
                                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-futuristic)', fontSize: '0.9rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={setupData.techStack}>{setupData.techStack}</div>
                            </div>
                        )}
                        <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '5px' }}>DIFFICULTY</div>
                            <div style={{ color: setupData.difficulty === 'hard' ? '#ef4444' : setupData.difficulty === 'medium' ? '#f59e0b' : '#22c55e', fontWeight: 700, fontFamily: 'var(--font-futuristic)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                                {setupData.difficulty}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '5px' }}>PROGRESS</div>
                            <div style={{ color: 'var(--accent-purple)', fontWeight: 700, fontFamily: 'var(--font-futuristic)', fontSize: '0.9rem' }}>Q {questionNumber} / {totalQuestions}</div>
                        </div>
                    </div>
                    
                    <div className="glass" style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <Timer />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: showCode ? '1fr 1fr' : '1fr 350px', gap: '30px', alignItems: 'start' }}>
                    
                    {/* Left: AI Avatar & Chat Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
                        
                        {/* Robot Avatar Area */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div style={{ 
                                position: 'absolute', inset: -20, 
                                background: 'radial-gradient(circle, rgba(59, 123, 246, 0.15), transparent 70%)',
                                borderRadius: '50%', zIndex: -1
                            }}></div>
                            <motion.div 
                                className="robot-avatar"
                                animate={loading ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    width: '180px', height: '180px', borderRadius: '50%',
                                    border: loading ? '2px solid var(--accent-cyan)' : '2px solid rgba(59, 123, 246, 0.3)',
                                    padding: '5px', background: 'rgba(5, 8, 16, 0.8)',
                                    boxShadow: loading ? '0 0 40px rgba(6, 214, 199, 0.3)' : '0 0 30px rgba(59, 123, 246, 0.2)',
                                    overflow: 'hidden'
                                }}
                            >
                                <img 
                                    src={robotAvatar} 
                                    alt="AI Assistant" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                                />
                            </motion.div>
                            
                            {/* Listening Status Orb */}
                            <AnimatePresence>
                                {isListening && (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        style={{
                                            position: 'absolute', bottom: '10px', right: '10px',
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', color: 'black', boxShadow: '0 0 20px var(--accent-cyan)'
                                        }}
                                    >
                                        <Mic size={18} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Question Bubble */}
                        <motion.div 
                            key={currentQuestion}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="glass"
                            style={{
                                width: '100%', padding: '40px', borderRadius: '30px',
                                background: 'rgba(12, 18, 32, 0.6)', border: '1px solid rgba(59, 123, 246, 0.2)',
                                textAlign: 'center', position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                                <Activity size={14} color="var(--accent-purple)" />
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Live Sentiment: <span style={{ color: 'white' }}>{sentiment}</span>
                                </span>
                            </div>

                            <p style={{ fontSize: '1.4rem', color: 'white', lineHeight: 1.6, fontWeight: 500 }}>
                                {loading && !showFeedback ? "Maya is processing your response..." : currentQuestion}
                            </p>

                            {isSpeaking && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px' }}>
                                    {[1, 2, 3, 4, 1, 2, 3].map((h, i) => (
                                        <motion.div 
                                            key={i}
                                            animate={{ height: [8, 20, 8] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                            style={{ width: '4px', background: 'var(--accent-cyan)', borderRadius: '2px' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Input Area */}
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="glass" style={{ 
                                padding: '10px', borderRadius: '20px', 
                                border: isListening ? '1px solid var(--accent-cyan)' : '1px solid var(--border)',
                                transition: 'all 0.3s ease'
                            }}>
                                <textarea 
                                    value={typedAnswer}
                                    onChange={e => setTypedAnswer(e.target.value)}
                                    placeholder={isListening ? "I'm listening..." : "Type your answer or use voice input..."}
                                    style={{
                                        width: '100%', background: 'transparent', border: 'none', color: 'white',
                                        padding: '15px', minHeight: '100px', fontSize: '1.1rem', outline: 'none',
                                        resize: 'none'
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <motion.button 
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                                console.log('Mic button clicked. Current state:', { isListening, isSupported: voiceSupported });
                                                if (!voiceSupported) {
                                                    alert("Your browser doesn't support Speech Recognition. Please use Chrome or Edge.");
                                                    return;
                                                }
                                                isListening ? stopListening() : startListening();
                                            }}
                                            className={isListening ? "btn-mic-active" : ""}
                                            style={{
                                                width: '50px', height: '50px', borderRadius: '50%',
                                                background: !voiceSupported ? '#333' : 'var(--bg-tertiary)', 
                                                border: 'none', cursor: voiceSupported ? 'pointer' : 'not-allowed',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                color: !voiceSupported ? '#666' : 'white',
                                                position: 'relative'
                                            }}
                                        >
                                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                            {!voiceSupported && (
                                                <div style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', borderRadius: '50%', width: '12px', height: '12px', border: '2px solid var(--bg-primary)' }} />
                                            )}
                                        </motion.button>
                                        {!voiceSupported && (
                                            <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 800 }}>NOT SUPPORTED</span>
                                        )}
                                        <button 
                                            onClick={() => setShowCode(!showCode)}
                                            style={{
                                                width: '50px', height: '50px', borderRadius: '50%',
                                                background: showCode ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-tertiary)', 
                                                border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                color: showCode ? 'var(--accent-purple)' : 'white'
                                            }}
                                        >
                                            <CodeIcon size={20} />
                                        </button>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSubmit}
                                        disabled={loading || !typedAnswer.trim()}
                                        style={{
                                            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                                            color: 'black', padding: '0 30px', height: '50px', borderRadius: '15px',
                                            fontWeight: 900, border: 'none', cursor: 'pointer',
                                            fontFamily: 'var(--font-futuristic)', fontSize: '0.8rem', letterSpacing: '1px',
                                            opacity: (loading || !typedAnswer.trim()) ? 0.5 : 1
                                        }}
                                    >
                                        SUBMIT ANSWER
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Feedback & Live Analytics (or Code Editor) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {showCode ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass"
                                style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                            >
                                <div style={{ padding: '15px 20px', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Terminal size={14} color="var(--accent-cyan)" />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>solution.py</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
                                            <Play size={12} fill="#22c55e" /> RUN
                                        </button>
                                        <Maximize2 size={12} color="var(--text-muted)" />
                                    </div>
                                </div>
                                <div style={{ flex: 1, background: '#050810', padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#94A3B8', overflow: 'auto' }}>
                                    <div style={{ color: '#8B5CF6' }}>def <span style={{ color: '#06D6C7' }}>solve_problem</span>(data):</div>
                                    <div style={{ paddingLeft: '20px', color: '#475569' }}># Your futuristic code goes here...</div>
                                    <div style={{ paddingLeft: '20px', color: '#F1F5F9' }}>result = []</div>
                                    <div style={{ paddingLeft: '20px' }}>&nbsp;</div>
                                    <div style={{ paddingLeft: '20px', color: '#8B5CF6' }}>for <span style={{ color: '#F1F5F9' }}>item</span> in <span style={{ color: '#F1F5F9' }}>data</span>:</div>
                                    <div style={{ paddingLeft: '40px', color: '#F1F5F9' }}>process(item)</div>
                                    <div style={{ paddingLeft: '20px' }}>&nbsp;</div>
                                    <div style={{ paddingLeft: '20px', color: '#8B5CF6' }}>return <span style={{ color: '#F1F5F9' }}>result</span></div>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Overall Confidence Metric */}
                                <div className="glass neon-border" style={{ padding: '30px', borderRadius: '25px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '15px' }}>OVERALL PERFORMANCE</div>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <svg width="120" height="120" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                            <motion.circle 
                                                cx="60" cy="60" r="54" fill="none" 
                                                stroke="var(--accent-cyan)" strokeWidth="8"
                                                strokeDasharray="339.29"
                                                initial={{ strokeDashoffset: 339.29 }}
                                                animate={{ strokeDashoffset: 339.29 - (339.29 * overallScore / 100) }}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-mono)' }}>{overallScore}</div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>PTS</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Assessment */}
                                <div className="glass" style={{ padding: '25px', borderRadius: '25px' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'white', fontWeight: 800, marginBottom: '25px', fontFamily: 'var(--font-futuristic)', letterSpacing: '1px' }}>LIVE ANALYTICS</div>
                                    <GlowingScoreBar label={setupData.interviewType === 'hr' ? "Clarity" : "Technical"} value={scores.technical} color="var(--accent-blue)" delta={lastScoreDelta?.technical ?? null} />
                                    <GlowingScoreBar label="Communication" value={scores.communication} color="var(--accent-cyan)" delta={lastScoreDelta?.communication ?? null} />
                                    <GlowingScoreBar label="Confidence" value={scores.confidence} color="var(--accent-purple)" delta={lastScoreDelta?.confidence ?? null} />
                                </div>

            {/* AI Feedback Modal Popup */}
            <AnimatePresence>
                {showFeedback && lastFeedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 2000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '20px', background: 'rgba(5, 8, 16, 0.9)',
                            backdropFilter: 'blur(12px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="glass holographic-grid"
                            style={{
                                width: '100%', maxWidth: '700px', padding: '40px', borderRadius: '40px',
                                border: '1px solid rgba(6, 214, 199, 0.4)',
                                boxShadow: '0 0 50px rgba(6, 214, 199, 0.15)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {/* Decorative Glow */}
                            <div style={{
                                position: 'absolute', top: '-100px', right: '-100px',
                                width: '200px', height: '200px', background: 'var(--accent-cyan)',
                                filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%'
                            }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                <div style={{ 
                                    width: '45px', height: '45px', borderRadius: '12px', 
                                    background: 'rgba(6, 214, 199, 0.15)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-cyan)'
                                }}>
                                    <Sparkles size={24} color="var(--accent-cyan)" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '1px' }}>AI JUDGMENT</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800, margin: 0 }}>PERFORMANCE ANALYSIS COMPLETE</p>
                                        <span style={{ 
                                            padding: '2px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900,
                                            background: verdict === 'Elite' || verdict === 'Professional' ? 'rgba(34, 197, 94, 0.2)' : 
                                                        verdict === 'Good' || verdict === 'Mediocre' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: verdict === 'Elite' || verdict === 'Professional' ? '#22c55e' : 
                                                   verdict === 'Good' || verdict === 'Mediocre' ? '#f59e0b' : '#ef4444',
                                            border: `1px solid ${verdict === 'Elite' || verdict === 'Professional' ? '#22c55e' : 
                                                                verdict === 'Good' || verdict === 'Mediocre' ? '#f59e0b' : '#ef4444'}`,
                                            textTransform: 'uppercase'
                                        }}>
                                            {verdict || 'Processing'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Score Changes */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '35px' }}>
                                {[
                                    { label: 'Technical', val: lastScoreDelta?.technical, color: 'var(--accent-blue)' },
                                    { label: 'Comm.', val: lastScoreDelta?.communication, color: 'var(--accent-cyan)' },
                                    { label: 'Confidence', val: lastScoreDelta?.confidence, color: 'var(--accent-purple)' }
                                ].map((s, i) => (
                                    <div key={i} className="glass" style={{ padding: '15px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '5px', textTransform: 'uppercase' }}>{s.label}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: (s.val || 0) >= 0 ? '#22c55e' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                                            {(s.val || 0) >= 0 ? `+${s.val}` : s.val}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '40px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <ThumbsUp size={16} color="#22c55e" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'white', letterSpacing: '1px' }}>WHAT YOU NAILED</span>
                                    </div>
                                    <div className="glass" style={{ padding: '20px', borderRadius: '18px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                                        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: 0 }}>
                                            {lastFeedback.positive}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Lightbulb size={16} color="var(--accent-gold)" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'white', letterSpacing: '1px' }}>ROOM FOR GROWTH</span>
                                    </div>
                                    <div className="glass" style={{ padding: '20px', borderRadius: '18px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                                        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: 0 }}>
                                            {lastFeedback.improvement}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6, 214, 199, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onProceedToNext}
                                style={{
                                    width: '100%', padding: '20px', borderRadius: '18px',
                                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                                    color: 'black', fontWeight: 900, border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                    fontFamily: 'var(--font-futuristic)', letterSpacing: '1px', fontSize: '0.9rem'
                                }}
                            >
                                PROCEED TO NEXT CHALLENGE <ChevronRight size={20} />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </FuturisticLayout>
    );
};

export default InterviewSession;
