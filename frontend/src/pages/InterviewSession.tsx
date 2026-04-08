import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Mic, MicOff, Volume2, VolumeX,
    ChevronRight, Sparkles, AlertCircle,
    ThumbsUp, Lightbulb
} from 'lucide-react';
import type { Scores, ScoreDelta, Feedback } from '../hooks/useInterview';

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
    setupData: { role: string; interviewType: string };
}

// ═══════════════════════════════════════════════════════════
// SCORE BAR COMPONENT
// ═══════════════════════════════════════════════════════════

const ScoreBar = ({ label, value, color, delta }: {
    label: string; value: number; color: string; delta: number | null;
}) => (
    <div style={{ marginBottom: '16px' }}>
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '8px',
        }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>
                    {value}
                </span>
                <AnimatePresence>
                    {delta !== null && delta !== 0 && (
                        <motion.span
                            initial={{ opacity: 0, y: -10, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            style={{
                                fontSize: '0.7rem', fontWeight: 800,
                                color: delta > 0 ? '#22c55e' : '#ef4444',
                                background: delta > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                padding: '2px 8px', borderRadius: '100px',
                                fontFamily: 'var(--font-mono)',
                            }}
                        >
                            {delta > 0 ? `+${delta}` : delta}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </div>
        <div style={{
            height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
            overflow: 'hidden', position: 'relative',
        }}>
            <motion.div
                initial={false}
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{
                    height: '100%', background: color, borderRadius: '10px',
                    boxShadow: `0 0 12px ${color}40`,
                }}
            />
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════
// THINKING SKELETON
// ═══════════════════════════════════════════════════════════

const ThinkingSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}
    >
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700,
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
                <Sparkles size={16} />
            </motion.div>
            Maya is thinking...
        </div>
        {[80, 60, 40].map((w, i) => (
            <div key={i} className="shimmer" style={{
                height: '14px', width: `${w}%`, borderRadius: '8px',
            }} />
        ))}
    </motion.div>
);

// ═══════════════════════════════════════════════════════════
// MAIN SESSION COMPONENT
// ═══════════════════════════════════════════════════════════

const InterviewSession: React.FC<InterviewSessionProps> = ({
    currentQuestion, questionNumber, totalQuestions, scores, lastScoreDelta,
    lastFeedback, showFeedback, loading, error, onSubmitAnswer, onProceedToNext,
    onDismissError, isListening, isSpeaking, transcript, startListening,
    stopListening, speak, stopSpeaking, resetTranscript, voiceSupported, setupData,
}) => {
    const [typedAnswer, setTypedAnswer] = useState('');
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasSpokenRef = useRef('');

    // Speak the question aloud when it changes
    useEffect(() => {
        if (currentQuestion && voiceEnabled && currentQuestion !== hasSpokenRef.current) {
            hasSpokenRef.current = currentQuestion;
            speak(currentQuestion);
        }
    }, [currentQuestion]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync voice transcript to typed answer
    useEffect(() => {
        if (transcript) {
            setTypedAnswer(transcript);
        }
    }, [transcript]);

    const handleSubmit = async () => {
        const answer = typedAnswer.trim();
        if (!answer || loading) return;
        stopListening();
        await onSubmitAnswer(answer);
        setTypedAnswer('');
        resetTranscript();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const toggleVoice = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const progressPercent = (questionNumber / totalQuestions) * 100;
    const overallScore = Math.round(scores.technical * 0.4 + scores.communication * 0.3 + scores.confidence * 0.3);

    return (
        <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}
        >
            {/* Progress Bar */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '10px',
                }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Question {questionNumber} of {totalQuestions}
                    </span>
                    <span style={{
                        fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)',
                        fontFamily: 'var(--font-mono)',
                    }}>
                        {Math.round(progressPercent)}%
                    </span>
                </div>
                <div style={{
                    height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                    overflow: 'hidden',
                }}>
                    <motion.div
                        initial={false}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))',
                            borderRadius: '10px',
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px' }}>
                {/* Main Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            className="glass"
                            style={{
                                padding: '36px', borderRadius: '24px',
                                borderLeft: '4px solid var(--accent-blue)',
                                position: 'relative',
                            }}
                        >
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', fontWeight: 900, color: '#050810',
                                }}>
                                    M
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                                    Maya — AI Interviewer
                                </span>
                                {isSpeaking && (
                                    <motion.div
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            padding: '3px 10px', borderRadius: '100px',
                                            background: 'rgba(6,214,199,0.1)', fontSize: '0.65rem',
                                            fontWeight: 800, color: 'var(--accent-cyan)',
                                        }}
                                    >
                                        <Volume2 size={12} /> Speaking
                                    </motion.div>
                                )}
                            </div>
                            {loading && !showFeedback ? (
                                <ThinkingSkeleton />
                            ) : (
                                <p style={{
                                    fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6,
                                    color: 'var(--text-primary)',
                                }}>
                                    {currentQuestion}
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Answer Area */}
                    {!showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass"
                            style={{ padding: '24px', borderRadius: '20px' }}
                        >
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: '12px',
                            }}>
                                <span style={{
                                    fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                }}>
                                    {isListening ? '🎙️ Listening — speak your answer...' : 'Your Answer'}
                                </span>
                                {voiceSupported && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
                                            style={{
                                                width: '34px', height: '34px', borderRadius: '10px',
                                                background: voiceEnabled ? 'rgba(59,123,246,0.1)' : 'rgba(239,68,68,0.1)',
                                                border: `1px solid ${voiceEnabled ? 'rgba(59,123,246,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                                color: voiceEnabled ? 'var(--accent-blue)' : '#ef4444',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                            title={voiceEnabled ? 'AI voice on' : 'AI voice off'}
                                        >
                                            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={typedAnswer}
                                onChange={e => setTypedAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your answer here or click the mic to speak..."
                                disabled={loading || isSpeaking}
                                style={{
                                    width: '100%', minHeight: '120px', maxHeight: '200px',
                                    background: 'transparent', border: 'none', outline: 'none',
                                    color: 'var(--text-primary)', fontSize: '1.1rem', fontFamily: 'var(--font-main)',
                                    lineHeight: 1.6, resize: 'vertical',
                                }}
                            />
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginTop: '12px', paddingTop: '12px',
                                borderTop: '1px solid var(--border)',
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {voiceSupported && (
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={toggleVoice}
                                            disabled={loading || isSpeaking}
                                            style={{
                                                width: '48px', height: '48px', borderRadius: '50%',
                                                background: isListening ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
                                                border: `1px solid ${isListening ? 'var(--accent-cyan)' : 'var(--border)'}`,
                                                color: isListening ? '#050810' : 'var(--text-secondary)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: isListening ? '0 0 20px rgba(6,214,199,0.4)' : 'none',
                                                transition: 'all 0.2s ease', position: 'relative',
                                            }}
                                        >
                                            {isListening && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    style={{
                                                        position: 'absolute', inset: -6, borderRadius: '50%',
                                                        background: 'var(--accent-cyan)',
                                                    }}
                                                />
                                            )}
                                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                        </motion.button>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleSubmit}
                                    disabled={loading || !typedAnswer.trim() || isSpeaking}
                                    className="btn-primary"
                                    style={{
                                        padding: '12px 28px', fontSize: '0.95rem',
                                        opacity: (!typedAnswer.trim() || loading) ? 0.5 : 1,
                                    }}
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
                                        />
                                    ) : (
                                        <>Submit <Send size={16} /></>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Feedback Card */}
                    <AnimatePresence>
                        {showFeedback && lastFeedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                className="glass"
                                style={{
                                    padding: '28px', borderRadius: '20px',
                                    borderLeft: '4px solid var(--accent-cyan)',
                                }}
                            >
                                <div style={{
                                    fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-cyan)',
                                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px',
                                }}>
                                    Instant Feedback
                                </div>

                                {lastFeedback.positive && (
                                    <div style={{
                                        display: 'flex', gap: '10px', marginBottom: '12px',
                                        padding: '12px 14px', borderRadius: '12px',
                                        background: 'rgba(34, 197, 94, 0.06)',
                                        border: '1px solid rgba(34, 197, 94, 0.12)',
                                    }}>
                                        <ThumbsUp size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            {lastFeedback.positive}
                                        </p>
                                    </div>
                                )}

                                {lastFeedback.improvement && (
                                    <div style={{
                                        display: 'flex', gap: '10px', marginBottom: '16px',
                                        padding: '12px 14px', borderRadius: '12px',
                                        background: 'rgba(245, 158, 11, 0.06)',
                                        border: '1px solid rgba(245, 158, 11, 0.12)',
                                    }}>
                                        <Lightbulb size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            {lastFeedback.improvement}
                                        </p>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onProceedToNext}
                                    className="btn-primary"
                                    style={{
                                        width: '100%', height: '52px', fontSize: '1rem',
                                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                                    }}
                                >
                                    Next Question <ChevronRight size={18} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    padding: '16px 20px', borderRadius: '14px',
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
                                    <AlertCircle size={18} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{error}</span>
                                </div>
                                <button
                                    onClick={onDismissError}
                                    style={{
                                        background: 'rgba(239,68,68,0.2)', border: 'none',
                                        color: '#ef4444', padding: '6px 14px', borderRadius: '8px',
                                        cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                                    }}
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar — Live Scores */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Overall Score */}
                    <div className="glass" style={{
                        padding: '28px', borderRadius: '20px', textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px',
                        }}>
                            Overall Score
                        </div>
                        <motion.div
                            key={overallScore}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            style={{
                                fontSize: '3.5rem', fontWeight: 900, color: 'white',
                                fontFamily: 'var(--font-mono)', lineHeight: 1,
                            }}
                        >
                            {overallScore}
                        </motion.div>
                        <div style={{
                            height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                            marginTop: '16px', overflow: 'hidden',
                        }}>
                            <motion.div
                                initial={false}
                                animate={{ width: `${overallScore}%` }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                style={{
                                    height: '100%',
                                    background: overallScore >= 70
                                        ? 'linear-gradient(90deg, #22c55e, #06D6C7)'
                                        : overallScore >= 50
                                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                            : 'linear-gradient(90deg, #ef4444, #f87171)',
                                    borderRadius: '10px',
                                }}
                            />
                        </div>
                    </div>

                    {/* Individual Scores */}
                    <div className="glass" style={{ padding: '24px', borderRadius: '20px' }}>
                        <div style={{
                            fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px',
                        }}>
                            Live Assessment
                        </div>
                        <ScoreBar
                            label="Technical Accuracy"
                            value={scores.technical}
                            color="var(--accent-blue)"
                            delta={lastScoreDelta?.technical ?? null}
                        />
                        <ScoreBar
                            label="Communication"
                            value={scores.communication}
                            color="var(--accent-cyan)"
                            delta={lastScoreDelta?.communication ?? null}
                        />
                        <ScoreBar
                            label="Confidence"
                            value={scores.confidence}
                            color="var(--accent-purple)"
                            delta={lastScoreDelta?.confidence ?? null}
                        />
                    </div>

                    {/* Interview Info */}
                    <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
                        <div style={{
                            fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px',
                        }}>
                            Session Info
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Role</span>
                                <span style={{ fontWeight: 700 }}>{setupData.role}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Type</span>
                                <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{setupData.interviewType}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InterviewSession;
