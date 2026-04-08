import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Zap, Target, Mic, ArrowRight, Play, Star,
    BarChart3, Users
} from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', paddingTop: '120px' }}>
            {/* Background Orbs */}
            <motion.div
                animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-orb" style={{ top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'var(--accent-blue)', opacity: 0.1 }}
            />
            <motion.div
                animate={{ x: [0, -80, 0], y: [0, 100, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-orb" style={{ bottom: '10%', right: '-5%', width: '35vw', height: '35vw', background: 'var(--accent-cyan)', opacity: 0.08 }}
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-orb" style={{ top: '30%', left: '40%', width: '30vw', height: '30vw', background: 'var(--accent-purple)', opacity: 0.06 }}
            />

            {/* Grid Overlay */}
            <div style={{
                position: 'fixed', inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                zIndex: -1, pointerEvents: 'none'
            }}></div>

            <div className="container">
                {/* Hero Section */}
                <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(59,123,246,0.1)', border: '1px solid rgba(59,123,246,0.2)', marginBottom: '32px' }}
                    >
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>✦ AI-Powered Interview Simulator</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: '72px', color: 'white', lineHeight: 1.1, marginBottom: '24px' }}
                    >
                        Get Interview-Ready.<br />
                        Get Brutally Honest<br />
                        <span style={{ background: 'linear-gradient(135deg, #3B7BF6, #06D6C7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Feedback.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6 }}
                    >
                        Practice with an AI that thinks like a Senior Director at Google. No fluff. No fake praise. Just real feedback.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '48px' }}
                    >
                        <Link to="/register" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                            Start Free Interview <ArrowRight size={20} />
                        </Link>
                        <button className="btn-secondary" style={{ padding: '16px 40px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Play size={20} /> Watch Demo
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
                    >
                        <div style={{ display: 'flex' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, #0C1220, #3B7BF6)`, border: '2px solid #050810', marginLeft: i === 1 ? 0 : '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>{String.fromCharCode(64 + i)}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />)}
                            </div>
                            <span>Trusted by 10,000+ candidates</span>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
                    style={{ marginTop: '80px', position: 'relative' }}
                >
                    <div className="glass" style={{ padding: '24px', borderRadius: '32px', borderTop: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.01)', maxWidth: '1000px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ width: '100%', aspectRatio: '16/9', background: '#050810', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-blue)', opacity: 0.2, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Target size={30} color="var(--accent-blue)" />
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Interview Terminal Preview</div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ position: 'absolute', bottom: '15%', left: '5%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-float)' }}
                        >
                            <Zap size={18} color="var(--accent-gold)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Real-time Scoring</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ position: 'absolute', top: '15%', right: '5%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-float)' }}
                        >
                            <Mic size={18} color="var(--accent-blue)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Voice-to-Voice AI</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ position: 'absolute', bottom: '10%', right: '10%', background: 'var(--accent-cyan)', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-float)', color: '#050810' }}
                        >
                            <Target size={18} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>HIRE VERDICT</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', margin: '140px 0' }}>
                    {[
                        { icon: <Zap />, title: "Hyper-Realistic", text: "Advanced LLMs trained on actual interview rubrics from MAANG companies." },
                        { icon: <BarChart3 />, title: "Metric Focused", text: "Detailed breakdown of technical depth, communication, and confidence." },
                        { icon: <Users />, title: "Role Specific", text: "Tailored questions for Frontend, Backend, Product Manager, and more." }
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, borderColor: 'rgba(59,123,246,0.4)', boxShadow: '0 0 40px rgba(59,123,246,0.1)' }}
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '40px', borderRadius: '24px', transition: 'all 0.3s ease' }}
                        >
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #3B7BF6, #06D6C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '24px' }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
