import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, History, TrendingUp, Calendar, Loader2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/interviews/history', {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setInterviews(data);
            } catch (err) {
                console.error('Error fetching history:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    const stats = [
        {
            icon: <TrendingUp size={20} />,
            label: "Avg. Score",
            value: interviews.length > 0
                ? Math.round(interviews.reduce((acc, curr) => acc + (curr.evaluation?.overallScore || 0), 0) / interviews.length) + '%'
                : '0%'
        },
        { icon: <Calendar size={20} />, label: "Last Session", value: interviews.length > 0 ? new Date(interviews[0].createdAt).toLocaleDateString() : 'N/A' },
        { icon: <Play size={20} />, label: "Interviews", value: interviews.length.toString() }
    ];

    return (
        <div style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ marginBottom: '8px' }}>Welcome back, {user?.name}!</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Ready to sharpen your skills today?</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '48px' }}>
                        <div className="glass" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Start New Session</h3>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>AI will generate a personalized interview based on your profile.</p>
                                <Link to="/interview" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                    <Play size={20} fill="currentColor" />
                                    <span>Start Interview</span>
                                </Link>
                            </div>
                            <Play size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
                        </div>

                        <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Recent History</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Your latest performances</p>
                                </div>
                                <History size={24} color="var(--color-primary)" />
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {loading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Loader2 className="animate-spin" /></div>
                                ) : interviews.length > 0 ? (
                                    interviews.slice(0, 3).map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: i !== 2 ? '1px solid var(--color-border)' : 'none' }}>
                                            <div>
                                                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.role}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(item.createdAt).toDateString()}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '100px',
                                                    background: item.evaluation?.overallScore >= 70 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: item.evaluation?.overallScore >= 70 ? '#10b981' : '#ef4444',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700'
                                                }}>
                                                    {item.evaluation?.overallScore || 0}%
                                                </div>
                                                <ChevronRight size={16} color="var(--color-text-muted)" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>No interviews yet. Start your first session!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {stats.map((stat, i) => (
                            <div key={i} className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                                <div style={{ marginBottom: '8px', color: 'var(--color-primary)', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
