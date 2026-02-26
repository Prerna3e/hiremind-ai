import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        padding: '8px 16px',
                        borderRadius: '100px',
                        color: 'var(--color-primary)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '24px',
                        border: '1px solid rgba(56, 189, 248, 0.2)'
                    }}>
                        <Sparkles size={16} />
                        <span>AI-Powered Interview Excellence</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '24px', lineHeight: 1 }}>
                        Master Your Next <br />
                        <span style={{ color: 'var(--color-primary)' }}>Interview with AI</span>
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                        Practice realistic technical and behavioral interviews with our advanced AI.
                        Get instant feedback, scoring, and personalized tips to land your dream job.
                    </p>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '14px 40px' }}>
                            Start Free Trial
                        </Link>
                        <button className="glass" style={{ padding: '14px 40px', fontSize: '1.1rem', color: 'white' }}>
                            View Demo
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}
                >
                    {[
                        { icon: <Zap color="#f59e0b" />, title: "Instant Feedback", desc: "Get analyzed scores on your answers immediately after the session." },
                        { icon: <Rocket color="#38bdf8" />, title: "Real Scenarios", desc: "Practice with questions tailored to specific job roles and seniority." },
                        { icon: <Shield color="#10b981" />, title: "Data Driven", desc: "Track your progress over time with detailed performance metrics." }
                    ].map((feature, i) => (
                        <div key={i} className="glass" style={{ padding: '32px', textAlign: 'left', transition: 'transform 0.3s' }}>
                            <div style={{ marginBottom: '20px' }}>{feature.icon}</div>
                            <h3 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
