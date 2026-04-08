import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Loader2, Sparkles, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Initialization failed. Neural database link unstable.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050810', position: 'relative', overflow: 'hidden' }}>
            {/* Background Orbs */}
            <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(59,123,246,0.1), transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(6, 214, 199, 0.08), transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ width: '100%', maxWidth: '520px', padding: '64px', borderRadius: '32px', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(6, 214, 199, 0.1)', border: '1px solid rgba(6, 214, 199, 0.2)', marginBottom: '24px' }}>
                        <Shield size={12} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Secure Onboarding</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '12px', color: 'white' }}>Initialize Profile</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Generate your persistent neural identity for HireMind <span style={{ color: 'var(--accent-blue)' }}>AI</span></p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {error && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                            {error}
                        </motion.div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Full Legal Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 56px', fontSize: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', color: 'white' }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 56px', fontSize: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', color: 'white' }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Encryption Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 56px', fontSize: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', color: 'white' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ height: '64px', fontSize: '1.1rem', marginTop: '12px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                <span>Create Profile →</span>
                            </>
                        )}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>
                            Identity already exists? <span style={{ color: 'var(--accent-blue)' }}>Start session</span>
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
