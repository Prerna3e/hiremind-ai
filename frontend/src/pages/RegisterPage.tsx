import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
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
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={{ width: '100%', maxWidth: '450px', padding: '48px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Join HireMind</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Start your journey to career excellence</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', paddingLeft: '48px' }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', paddingLeft: '48px' }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', paddingLeft: '48px' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <span>Create Account</span>
                                <UserPlus size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Sign in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
