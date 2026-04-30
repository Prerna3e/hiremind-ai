import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Plus, History, BarChart2,
    Flame, Trophy, Activity,
    ChevronRight, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import FuturisticLayout from '../components/FuturisticLayout';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        completed: 0,
        avgScore: 0,
        eliteRating: 0,
        streak: 0
    });
    const [interviews, setInterviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/interviews`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const completedInterviews = res.data.filter((iv: any) => iv.status === 'completed');
                setInterviews(completedInterviews);

                if (completedInterviews.length > 0) {
                    const avg = completedInterviews.reduce((acc: number, curr: any) => acc + (curr.evaluation?.overallScore || 0), 0) / completedInterviews.length;
                    const best = Math.max(...completedInterviews.map((iv: any) => iv.evaluation?.overallScore || 0));
                    
                    // Calculate Streak
                    const dates = completedInterviews.map((iv: any) => new Date(iv.createdAt).toDateString());
                    const uniqueDates = Array.from(new Set<string>(dates)).map((d: string) => new Date(d));
                    uniqueDates.sort((a, b) => b.getTime() - a.getTime());
                    
                    let streak = 0;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    // Check if they did one today or yesterday to start the streak
                    const firstDate = uniqueDates[0];
                    if (firstDate) {
                        const diff = (today.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);
                        if (diff <= 1) {
                            streak = 1;
                            for (let i = 1; i < uniqueDates.length; i++) {
                                const diffPrev = (uniqueDates[i-1].getTime() - uniqueDates[i].getTime()) / (1000 * 3600 * 24);
                                if (diffPrev === 1) {
                                    streak++;
                                } else {
                                    break;
                                }
                            }
                        }
                    }

                    setStats({
                        completed: completedInterviews.length,
                        avgScore: Math.round(avg),
                        eliteRating: best,
                        streak: streak
                    });
                }
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <FuturisticLayout>
            <div className="full-width-container">
                <header style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <Sparkles size={24} color="var(--accent-cyan)" />
                        <h1 style={{ fontSize: '2.5rem', color: 'white', fontFamily: 'var(--font-futuristic)', letterSpacing: '2px' }}>
                            WELCOME BACK, {user?.name.split(' ')[0].toUpperCase()}
                        </h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Your neural ranking is looking strong. You've completed <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{stats.completed} sessions</span> this month.
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {[
                        { label: "Sessions", value: stats.completed, suffix: "", icon: <History />, color: 'var(--accent-blue)' },
                        { label: "Avg Precision", value: stats.avgScore, suffix: "%", icon: <BarChart2 />, color: 'var(--accent-cyan)' },
                        { label: "Elite Rating", value: stats.eliteRating, suffix: "%", icon: <Trophy />, color: 'var(--accent-purple)' },
                        { label: "Synergy Streak", value: stats.streak, suffix: "d", icon: <Flame />, color: 'var(--accent-gold)' }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i} 
                            whileHover={{ scale: 1.05 }}
                            className="glass" 
                            style={{ 
                                padding: '30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '15px',
                                border: `1px solid rgba(255,255,255,0.05)`,
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: `radial-gradient(circle at top right, ${stat.color}20, transparent)`, zIndex: 0 }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-futuristic)' }}>{stat.label}</span>
                                <div style={{ color: stat.color }}>{stat.icon}</div>
                            </div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-mono)', position: 'relative', zIndex: 1 }}>
                                {stat.value}{stat.suffix}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* New Interview CTA */}
                <motion.div
                    whileHover={{ scale: 1.01, boxShadow: '0 0 50px rgba(59, 123, 246, 0.2)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate('/interview')}
                    className="glass neon-border"
                    style={{
                        background: 'linear-gradient(135deg, rgba(5, 8, 16, 0.8), rgba(12, 18, 32, 0.9))',
                        padding: '80px 60px', borderRadius: '40px', marginBottom: '48px',
                        cursor: 'pointer', position: 'relative', overflow: 'hidden'
                    }}
                >
                    <div className="hologram-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}></div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ maxWidth: '70%' }}>
                            <h2 style={{ fontSize: '3.2rem', fontWeight: 900, color: 'white', marginBottom: '20px', fontFamily: 'var(--font-futuristic)', letterSpacing: '3px' }}>
                                INITIATE <span style={{ color: 'var(--accent-cyan)' }}>SESSION</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 400, lineHeight: 1.6 }}>
                                Deploy your skills against our advanced AI models. Real-time feedback, behavioral analysis, and technical vetting.
                            </p>
                        </div>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            style={{ 
                                width: '120px', height: '120px', borderRadius: '50%', 
                                background: 'rgba(59, 123, 246, 0.05)', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center', 
                                border: '1px solid rgba(59, 123, 246, 0.2)',
                                boxShadow: '0 0 30px rgba(59, 123, 246, 0.1)'
                            }}
                        >
                            <Plus size={60} color="var(--accent-blue)" strokeWidth={1} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* History Table */}
                <div className="glass" style={{ padding: '40px', borderRadius: '30px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'white', fontFamily: 'var(--font-futuristic)', letterSpacing: '1px' }}>DATA LOGS</h3>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-futuristic)' }}>VIEW ALL ENTRIES</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {interviews.length > 0 ? interviews.slice(0, 5).map((iv, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ background: 'rgba(255,255,255,0.03)', x: 10 }}
                                className="history-grid-item"
                            >
                                <div className="icon-col" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px', border: '1px solid var(--border)' }}>
                                    <Activity size={22} color="var(--accent-cyan)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>{iv.role || 'Google SDE-2'}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{iv.interviewType || 'Technical'}</div>
                                </div>
                                <div className="hide-on-mobile" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{new Date(iv.createdAt).toLocaleDateString()}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-mono)' }}>{iv.evaluation?.overallScore || 0}</div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '6px 15px', borderRadius: '100px', background: (iv.evaluation?.overallScore || 0) > 70 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: (iv.evaluation?.overallScore || 0) > 70 ? '#22c55e' : '#EF4444', fontFamily: 'var(--font-futuristic)', border: `1px solid ${(iv.evaluation?.overallScore || 0) > 70 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                                        {(iv.evaluation?.overallScore || 0) > 70 ? 'HIRED' : 'RETRY'}
                                    </span>
                                </div>
                                < ChevronRight size={20} color="var(--text-muted)" />
                            </motion.div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>NO DATA DETECTED</div>
                                <p>Ready to begin your first simulation?</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FuturisticLayout>
    );
};

export default Dashboard;
