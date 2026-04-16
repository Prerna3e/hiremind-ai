import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Zap, Target, Mic, ArrowRight, Play, Star,
    BarChart3, Users, Sparkles, Shield, Cpu
} from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            
            {/* Animated Neural Background */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, var(--accent-blue), transparent 70%)', filter: 'blur(80px)' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 18, repeat: Infinity, delay: 2 }}
                    style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, var(--accent-purple), transparent 70%)', filter: 'blur(80px)' }}
                />
            </div>

            {/* Content Container */}
            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '160px', paddingBottom: '100px' }}>
                
                {/* Hero Badge */}
                <center>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '10px', 
                        padding: '10px 24px', borderRadius: '100px', 
                        background: 'rgba(59, 123, 246, 0.05)', 
                        border: '1px solid rgba(59, 123, 246, 0.2)', 
                        marginBottom: '40px',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Sparkles size={16} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', letterSpacing: '2px', fontFamily: 'var(--font-futuristic)' }}>
                        NEURAL INTERVIEW PROTOCOL v2.0
                    </span>
                </motion.div>
                </center>

                <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ 
                            fontSize: 'clamp(3rem, 8vw, 6rem)', 
                            color: 'white', 
                            lineHeight: 0.95, 
                            marginBottom: '30px', 
                            fontFamily: 'var(--font-futuristic)',
                            fontWeight: 900,
                            letterSpacing: '-2px'
                        }}
                    >
                        EVOLVE BEYOND THE<br />
                        <span style={{ 
                            background: 'linear-gradient(90deg, #3B7BF6, #06D6C7, #8B5CF6)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 20px rgba(6, 214, 199, 0.3))'
                        }}>
                            HUMAN LIMIT.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ 
                            fontSize: '1.4rem', color: 'var(--text-secondary)', 
                            maxWidth: '750px', margin: '0 auto 60px', 
                            lineHeight: 1.5, fontWeight: 500 
                        }}
                    >
                        Master the art of the interview with the world's most advanced AI simulator. 
                        Trained on 10M+ data points from Top Tier Tech firms.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ display: 'flex', gap: '25px', justifyContent: 'center', marginBottom: '100px' }}
                    >
                        <Link to="/register" className="btn-primary neon-border" style={{ 
                            padding: '24px 50px', fontSize: '0.9rem', 
                            fontFamily: 'var(--font-futuristic)', letterSpacing: '2px',
                            background: 'white', color: 'black', fontWeight: 900
                        }}>
                            INITIALIZE INTERVIEW <ArrowRight size={20} />
                        </Link>
                        <button className="btn-secondary" style={{ 
                            padding: '24px 50px', fontSize: '0.9rem', 
                            fontFamily: 'var(--font-futuristic)', letterSpacing: '2px',
                            background: 'rgba(255,255,255,0.02)', fontWeight: 800
                        }}>
                             CORE SPECS <Cpu size={20} />
                        </button>
                    </motion.div>
                </div>

                {/* Hero Feature Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '50px' }}>
                    {[
                        { icon: <Target />, label: "Precision AI", desc: "98% accuracy in technical vetting" },
                        { icon: <Mic />, label: "Voice Engine", desc: "Real-time natural speech analysis" },
                        { icon: <Shield />, label: "Privacy Core", desc: "Military-grade data encryption" },
                        { icon: <Zap />, label: "Instant Analytics", desc: "Deep metrics in < 1ms" }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            whileHover={{ y: -10, borderColor: 'var(--accent-blue)' }}
                            style={{ 
                                padding: '30px', background: 'rgba(12, 18, 32, 0.4)', 
                                border: '1px solid var(--border)', borderRadius: '25px',
                                backdropFilter: 'blur(10px)', transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ color: 'var(--accent-cyan)', marginBottom: '20px' }}>{feature.icon}</div>
                            <div style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', fontFamily: 'var(--font-futuristic)' }}>{feature.label.toUpperCase()}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>{feature.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Grid Pattern Overlay */}
            <div className="hologram-grid" style={{ position: 'fixed', inset: 0, opacity: 0.1, pointerEvents: 'none', zIndex: 0 }}></div>
        </div>
    );
};

export default LandingPage;
