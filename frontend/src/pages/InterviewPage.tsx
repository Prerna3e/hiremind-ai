import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Clock, Loader2, AlertCircle, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview';
import { useVoice } from '../hooks/useVoice';
import InterviewSetup from './InterviewSetup';
import InterviewSession from './InterviewSession';
import InterviewSummary from './InterviewSummary';
import Sidebar from '../components/Sidebar';

const InterviewPage: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const navigate = useNavigate();

    const interview = useInterview();
    const voice = useVoice((autoTranscript) => {
        // Auto-submit after 2s silence
        if (interview.phase === 'interview' && !interview.loading && !interview.showFeedback) {
            interview.submitAnswer(autoTranscript);
        }
    });

    return (
        <div style={{
            background: '#050810', minHeight: '100vh', color: 'white',
            position: 'relative', overflow: 'hidden',
        }}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Ambient Background Orbs */}
            <div style={{
                position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, rgba(59, 123, 246, 0.08), transparent 70%)',
                filter: 'blur(100px)', zIndex: 0,
            }} />
            <div style={{
                position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, rgba(6, 214, 199, 0.06), transparent 70%)',
                filter: 'blur(100px)', zIndex: 0,
            }} />
            <div style={{
                position: 'fixed', top: '30%', left: '50%', width: '30%', height: '30%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.04), transparent 70%)',
                filter: 'blur(120px)', zIndex: 0,
            }} />

            {/* Header Bar */}
            <header style={{
                height: '72px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 40px', position: 'relative', zIndex: 10,
                background: 'rgba(5, 8, 16, 0.6)', backdropFilter: 'blur(20px)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                    >
                        <LayoutDashboard size={20} />
                    </button>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'var(--accent-blue)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <BrainCircuit size={18} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
                            HireMind <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
                        </span>
                    </Link>
                </div>

                {interview.phase === 'interview' && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'rgba(255, 0, 0, 0.08)', padding: '6px 16px',
                        borderRadius: '100px', border: '1px solid rgba(255, 0, 0, 0.15)',
                    }}>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                width: '8px', height: '8px', background: '#ef4444',
                                borderRadius: '50%',
                            }}
                        />
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 800, color: '#ef4444',
                            letterSpacing: '0.1em',
                        }}>
                            LIVE SESSION — {interview.setupData.role}
                        </span>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {interview.phase === 'interview' && (
                        <div style={{
                            fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                            fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <Clock size={14} />
                            Q{interview.questionNumber}/{interview.totalQuestions}
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                        Exit
                    </button>
                </div>
            </header>

            {/* Session Progress Bar */}
            {interview.phase === 'interview' && (
                <div style={{ 
                    height: '2px', width: '100%', background: 'rgba(255,255,255,0.05)', 
                    position: 'relative', zIndex: 10, overflow: 'hidden' 
                }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(interview.questionNumber / interview.totalQuestions) * 100}%` }}
                        style={{ 
                            height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))',
                            boxShadow: '0 0 10px var(--accent-cyan)'
                        }}
                    />
                </div>
            )}

            {/* Main Content */}
            <main className="full-width-container" style={{
                position: 'relative', zIndex: 1, paddingTop: '40px',
            }}>
                <AnimatePresence mode="wait">
                    {/* SETUP PHASE */}
                    {interview.phase === 'setup' && (
                        <InterviewSetup
                            key="setup"
                            setupData={interview.setupData}
                            setSetupData={interview.setSetupData}
                            onStart={interview.startInterview}
                            loading={interview.loading}
                        />
                    )}

                    {/* INTERVIEW PHASE */}
                    {interview.phase === 'interview' && (
                        <InterviewSession
                            key="interview"
                            currentQuestion={interview.currentQuestion}
                            questionNumber={interview.questionNumber}
                            totalQuestions={interview.totalQuestions}
                            scores={interview.scores}
                            lastScoreDelta={interview.lastScoreDelta}
                            lastFeedback={interview.lastFeedback}
                            showFeedback={interview.showFeedback}
                            loading={interview.loading}
                            error={interview.error}
                            onSubmitAnswer={interview.submitAnswer}
                            onProceedToNext={interview.proceedToNextQuestion}
                            onDismissError={interview.dismissError}
                            isListening={voice.isListening}
                            isSpeaking={voice.isSpeaking}
                            transcript={voice.transcript}
                            startListening={voice.startListening}
                            stopListening={voice.stopListening}
                            speak={voice.speak}
                            stopSpeaking={voice.stopSpeaking}
                            resetTranscript={voice.resetTranscript}
                            voiceSupported={voice.isSupported}
                            setupData={interview.setupData}
                            verdict={interview.verdict}
                            sentiment={interview.sentiment}
                        />
                    )}

                    {/* SUMMARY PHASE */}
                    {interview.phase === 'summary' && interview.evaluation && (
                        <InterviewSummary
                            key="summary"
                            evaluation={interview.evaluation}
                            scores={interview.scores}
                            setupData={interview.setupData}
                            onRetry={interview.retryInterview}
                            onNewInterview={interview.resetInterview}
                            onGoToDashboard={() => navigate('/dashboard')}
                        />
                    )}

                    {/* Loading overlay for evaluation */}
                    {interview.phase === 'interview' && interview.loading && interview.showFeedback === false && interview.currentQuestion === '' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                position: 'fixed', inset: 0, zIndex: 100,
                                background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(10px)',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: '20px',
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader2 size={40} color="var(--accent-blue)" />
                            </motion.div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                Maya is preparing your evaluation...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
 
             {/* Global Error Banner */}
             <AnimatePresence>
                 {interview.error && (
                     <motion.div 
                         initial={{ opacity: 0, y: 50 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0 }}
                         style={{
                             position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                             zIndex: 1000, background: 'rgba(239, 68, 68, 0.9)', backdropFilter: 'blur(10px)',
                             padding: '12px 25px', borderRadius: '100px', display: 'flex', alignItems: 'center',
                             gap: '15px', border: '1px solid #ef4444', color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                         }}
                     >
                         <AlertCircle size={18} />
                         <span style={{ fontWeight: 600 }}>{interview.error}</span>
                         <button onClick={interview.dismissError} style={{ background: 'white', border: 'none', color: '#ef4444', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 900 }}>×</button>
                     </motion.div>
                 )}
             </AnimatePresence>
        </div>
    );
};

export default InterviewPage;
