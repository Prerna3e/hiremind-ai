import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus, History, BarChart2, Star,
    Flame, Trophy, Activity,
    LayoutDashboard, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        completed: 0,
        avgScore: 0,
        bestPerformance: 'N/A',
        streak: 0
    });
    const [interviews, setInterviews] = useState<any[]>([]);

    useEffect(() => {
        // Fetch stats and past interviews
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/interviews', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setInterviews(res.data);

                if (res.data.length > 0) {
                    const avg = res.data.reduce((acc: number, curr: any) => acc + (curr.evaluation?.overallScore || 0), 0) / res.data.length;
                    setStats({
                        completed: res.data.length,
                        avgScore: Math.round(avg),
                        bestPerformance: 'Google SDE-2', // Mocking for now
                        streak: 3
                    });
                }
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '80px' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border)',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'fixed',
                top: '80px',
                bottom: 0,
                zIndex: 10
            }}>
                {[
                    { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: true },
                    { icon: <Plus size={20} />, label: "New Session", active: false, path: "/interview" },
                    { icon: <History size={20} />, label: "History", active: false },
                    { icon: <Star size={20} />, label: "Analytics", active: false }
                ].map((item, i) => (
                    <Link
                        key={i}
                        to={item.path || '#'}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                            background: item.active ? 'rgba(59,123,246,0.1)' : 'transparent',
                            color: item.active ? 'white' : 'var(--text-secondary)',
                            borderLeft: item.active ? '3px solid var(--accent-blue)' : '3px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span style={{ color: item.active ? 'var(--accent-blue)' : 'inherit' }}>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B7BF6, #06D6C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800 }}>PRO MEMBER</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '260px', padding: '48px 64px' }}>
                <header style={{ marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '8px' }}>Good morning, {user?.name.split(' ')[0]} 👋</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>You have {stats.completed} interviews completed. Keep pushing.</p>
                </header>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
                    {[
                        { label: "Completed", value: stats.completed, suffix: "", icon: <History />, color: 'var(--accent-blue)' },
                        { label: "Avg Score", value: stats.avgScore, suffix: "%", icon: <BarChart2 />, color: 'var(--accent-cyan)' },
                        { label: "Best Class", value: 88, suffix: "%", icon: <Trophy />, color: 'var(--accent-purple)' },
                        { label: "Streak", value: stats.streak, suffix: "d", icon: <Flame />, color: 'var(--accent-gold)' }
                    ].map((stat, i) => (
                        <div key={i} className="glass" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                                <div style={{ color: stat.color }}>{stat.icon}</div>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>{stat.value}{stat.suffix}</div>
                        </div>
                    ))}
                </div>

                {/* New Interview CTA */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate('/interview')}
                    style={{
                        background: 'linear-gradient(135deg, #1a2a6c, #3B7BF6, #06D6C7)',
                        padding: '48px', borderRadius: '24px', marginBottom: '48px',
                        cursor: 'pointer', position: 'relative', overflow: 'hidden',
                        boxShadow: 'var(--shadow-glow-blue)'
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', width: '200%', animation: 'shimmer 3s infinite', pointerEvents: 'none' }}></div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Start New Interview →</h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', fontWeight: 500 }}>Choose your role, company, and go live with Alex & Sarah.</p>
                        </div>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={40} color="white" />
                        </div>
                    </div>
                </motion.div>

                {/* History Table */}
                <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'white' }}>Recent History</h3>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>View All</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {interviews.length > 0 ? interviews.slice(0, 5).map((iv, i) => (
                            <div key={i} style={{
                                display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr auto', alignItems: 'center',
                                padding: '16px 24px', borderRadius: '16px', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                border: '1px solid transparent', transition: 'all 0.2s ease', cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                                    <Activity size={20} color="var(--accent-cyan)" />
                                </div>
                                <div style={{ fontWeight: 700, color: 'white' }}>Google SDE-2</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(iv.createdAt).toLocaleDateString()}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>{iv.evaluation?.overallScore || 0}</div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', background: (iv.evaluation?.overallScore || 0) > 70 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: (iv.evaluation?.overallScore || 0) > 70 ? '#10B981' : '#EF4444' }}>
                                        {(iv.evaluation?.overallScore || 0) > 70 ? 'HIRE' : 'NO HIRE'}
                                    </span>
                                </div>
                                < ChevronRight size={18} color="var(--text-muted)" />
                            </div>
                        )) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No interviews found. Ready to start your first one?</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
