import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload, CheckCircle2, AlertTriangle, 
    Zap, Search, Target, 
    RefreshCw, Layers, Sparkles
} from 'lucide-react';
import FuturisticLayout from '../components/FuturisticLayout';
import robotAvatar from '../assets/robot-avatar.png';

const ResumeAnalysis: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [role, setRole] = useState('Frontend Engineer');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            startAnalysis();
        }
    };

    const startAnalysis = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setShowResults(true);
        }, 3000);
    };

    return (
        <FuturisticLayout>
            <div className="full-width-container">
                
                {/* Header with Role Selection */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-futuristic)', color: 'white', fontSize: '2rem', letterSpacing: '2px', marginBottom: '10px' }}>
                            RESUME <span style={{ color: 'var(--accent-cyan)' }}>INTELLIGENCE</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>AI-powered extraction and optimization engine.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '5px' }}>TARGET POSITION</div>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                style={{ 
                                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)', 
                                    color: 'white', padding: '8px 15px', borderRadius: '10px',
                                    fontWeight: 700, fontFamily: 'var(--font-main)', outline: 'none'
                                }}
                            >
                                <option>Frontend Engineer</option>
                                <option>Backend Developer</option>
                                <option>Fullstack SDE</option>
                                <option>Data Scientist</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid-sidebar-left">
                    
                    {/* LEFT PANEL: Upload & Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="glass" style={{ padding: '40px', borderRadius: '30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <input 
                                type="file" 
                                id="resume-upload" 
                                style={{ display: 'none' }} 
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx"
                            />
                            <label htmlFor="resume-upload" style={{ cursor: 'pointer' }}>
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    style={{ 
                                        border: '2px dashed rgba(59, 123, 246, 0.3)', 
                                        borderRadius: '20px', padding: '40px 20px',
                                        background: 'rgba(59, 123, 246, 0.02)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                                    }}
                                >
                                    <div style={{ 
                                        width: '80px', height: '80px', borderRadius: '50%', 
                                        background: 'rgba(59, 123, 246, 0.1)', display: 'flex', 
                                        alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)'
                                    }}>
                                        <Upload size={32} />
                                    </div>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>
                                            {file ? file.name : 'Drop Resume Here'}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            PDF, DOCX up to 10MB
                                        </div>
                                    </div>
                                    <button className="btn-primary" style={{ padding: '12px 30px', borderRadius: '12px', background: 'var(--accent-blue)', color: 'white', border: 'none', fontWeight: 800, pointerEvents: 'none' }}>
                                        SELECT FILE
                                    </button>
                                </motion.div>
                            </label>

                            <div style={{ marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                — OR PASTE TEXT MANUALLY —
                            </div>
                            <textarea 
                                placeholder="Paste your resume content here..."
                                style={{ 
                                    width: '100%', marginTop: '20px', height: '150px', 
                                    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                                    borderRadius: '15px', padding: '15px', color: 'white',
                                    fontSize: '0.9rem', outline: 'none', resize: 'none'
                                }}
                            />
                        </div>

                        {/* Resume Highlighted Preview */}
                        <AnimatePresence>
                            {showResults && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass" 
                                    style={{ padding: '30px', borderRadius: '30px', background: 'rgba(5, 8, 16, 0.5)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-futuristic)' }}>NEURAL SCAN PREVIEW</div>
                                        <Layers size={16} color="var(--accent-cyan)" />
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
                                        <p style={{ marginBottom: '10px' }}><span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 4px', borderRadius: '4px' }}>Senior Frontend Engineer</span> with 5+ years experience.</p>
                                        <p style={{ marginBottom: '10px' }}>Proficient in <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 4px', borderRadius: '4px' }}>React, TypeScript, Redux</span>.</p>
                                        <p style={{ marginBottom: '10px' }}>Developed a <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 4px', borderRadius: '4px' }}>scalable dashboard</span> for clients.</p>
                                        <p style={{ color: 'var(--text-muted)' }}>Managed a team of 3 developers...</p>
                                        <div style={{ 
                                            marginTop: '15px', padding: '10px', borderRadius: '8px', 
                                            background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444', fontSize: '0.7rem', fontWeight: 700
                                        }}>
                                            FIX: "scalable dashboard" is too vague. Use metrics.
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT PANEL: Analysis Dashboard */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        
                        <AnimatePresence mode="wait">
                            {isScanning ? (
                                <motion.div 
                                    key="scanning"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ 
                                        height: '600px', display: 'flex', flexDirection: 'column', 
                                        alignItems: 'center', justifyContent: 'center', gap: '30px' 
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            style={{ 
                                                width: '150px', height: '150px', borderRadius: '50%',
                                                border: '2px solid transparent', borderTopColor: 'var(--accent-cyan)',
                                                borderBottomColor: 'var(--accent-blue)', boxShadow: '0 0 30px rgba(6, 214, 199, 0.2)'
                                            }}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Search size={40} color="white" />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ color: 'white', fontFamily: 'var(--font-futuristic)', letterSpacing: '2px', marginBottom: '10px' }}>DEEP SCANNING RESUME...</h3>
                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                            {['KEYWORDS', 'ATS-CHECK', 'SEMANTIC', 'SCORING'].map((step, i) => (
                                                <motion.div 
                                                    key={i}
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                    style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', fontWeight: 800 }}
                                                >
                                                    {step} •
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : showResults ? (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                                >
                                    {/* Main Score & Summary */}
                                    <div className="grid-1-2-responsive">
                                        <div className="glass neon-border" style={{ padding: '30px', borderRadius: '30px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '20px', fontFamily: 'var(--font-futuristic)' }}>OVERALL SCORE</div>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <svg width="150" height="150" viewBox="0 0 150 150">
                                                    <circle cx="75" cy="75" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                                    <motion.circle 
                                                        cx="75" cy="75" r="68" fill="none" stroke="var(--accent-cyan)" strokeWidth="10"
                                                        strokeDasharray="427.26"
                                                        initial={{ strokeDashoffset: 427.26 }}
                                                        animate={{ strokeDashoffset: 427.26 - (427.26 * 84 / 100) }}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-mono)' }}>84</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>STRONG</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass" style={{ padding: '30px', borderRadius: '30px', display: 'flex', gap: '25px', alignItems: 'center' }}>
                                            <div style={{ width: '100px', height: '100px', flexShrink: 0 }} className="robot-avatar">
                                                <img src={robotAvatar} alt="AI" style={{ width: '100%', borderRadius: '50%' }} />
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.75rem', marginBottom: '10px' }}>AI EXECUTIVE SUMMARY</div>
                                                <p style={{ color: 'white', fontSize: '1rem', lineHeight: 1.5, fontWeight: 500 }}>
                                                    "Your technical profile is elite, especially in React ecosystems. However, your project impact statements are missing quantifiable metrics. Add data to increase ATS rank by ~12%."
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section-wise Analysis */}
                                    <div className="grid-cols-4-responsive">
                                        {[
                                            { label: "Skills Match", val: 92, color: 'var(--accent-blue)' },
                                            { label: "Exp Quality", val: 78, color: 'var(--accent-purple)' },
                                            { label: "Project Depth", val: 85, color: 'var(--accent-cyan)' },
                                            { label: "Education", val: 100, color: '#22c55e' }
                                        ].map((item, i) => (
                                            <div key={i} className="glass" style={{ padding: '20px', borderRadius: '20px' }}>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '15px' }}>{item.label}</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>{item.val}%</div>
                                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.val}%` }}
                                                        style={{ height: '100%', background: item.color, boxShadow: `0 0 10px ${item.color}` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Keywords & Fixes */}
                                    <div className="grid-cols-2-responsive">
                                        <div className="glass" style={{ padding: '30px', borderRadius: '30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <Target size={18} color="var(--accent-cyan)" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>MISSING RELEVANT KEYWORDS</span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {['Next.js', 'CI/CD Pipelines', 'AWS Lambda', 'Web Vitals', 'Unit Testing', 'GraphQL'].map((kw, i) => (
                                                    <div key={i} style={{ 
                                                        padding: '6px 14px', borderRadius: '10px', 
                                                        background: 'rgba(59, 123, 246, 0.1)', border: '1px solid rgba(59, 123, 246, 0.2)',
                                                        color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 700 
                                                    }}>
                                                        + {kw}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="glass" style={{ padding: '30px', borderRadius: '30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <Zap size={18} color="var(--accent-gold)" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>ATS COMPATIBILITY</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Standard Formatting</span>
                                                    <CheckCircle2 size={16} color="#22c55e" />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Section Headings</span>
                                                    <CheckCircle2 size={16} color="#22c55e" />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Table/Columns Check</span>
                                                    <AlertTriangle size={16} color="#ef4444" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bullet Point AI Suggestions */}
                                    <div className="glass holographic-grid" style={{ padding: '30px', borderRadius: '30px', border: '1px solid rgba(6, 214, 199, 0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Sparkles size={18} color="var(--accent-cyan)" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>AI BULLET OPTIMIZER</span>
                                            </div>
                                            <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>REWRITE ALL</button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <div style={{ padding: '15px', borderRadius: '15px', background: 'rgba(0,0,0,0.2)' }}>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px' }}>ORIGINAL</div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>"Responsible for building the dashboard UI using React."</p>
                                                <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0' }}></div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginBottom: '5px' }}>AI OPTIMIZED ✨</div>
                                                <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>"Architected a high-performance React dashboard, improving data rendering speed by 40% using memoization and custom hooks."</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Actions */}
                                    <div className="action-buttons-container">
                                        <button className="btn-primary" style={{ flex: 1, height: '55px', borderRadius: '15px', background: 'var(--accent-cyan)', color: 'black', fontWeight: 900, fontFamily: 'var(--font-futuristic)', border: 'none' }}>
                                            DOWNLOAD IMPROVED RESUME
                                        </button>
                                        <button 
                                            onClick={() => alert('Starting Mock Interview...')}
                                            className="btn-primary" 
                                            style={{ flex: 1, height: '55px', borderRadius: '15px', background: 'transparent', border: '1px solid var(--accent-blue)', color: 'white', fontWeight: 900, fontFamily: 'var(--font-futuristic)' }}
                                        >
                                            START MOCK INTERVIEW
                                        </button>
                                    </div>

                                </motion.div>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    <RefreshCw size={50} style={{ marginBottom: '20px', opacity: 0.2 }} />
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 400 }}>Upload a file to begin Neural Analysis</h2>
                                    <p>Our AI will simulate a recruiter scan to identify gaps.</p>
                                </div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </FuturisticLayout>
    );
};

export default ResumeAnalysis;
