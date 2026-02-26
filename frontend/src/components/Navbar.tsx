import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            margin: '0 auto'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-outfit)' }}>
                <Cpu size={32} color="var(--color-primary)" />
                <span style={{ background: 'linear-gradient(to right, #fff, var(--color-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    HireMind AI
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: '500' }}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        <div style={{ height: '24px', width: '1px', background: 'var(--color-border)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</span>
                            </div>
                            <button onClick={handleLogout} style={{ background: 'transparent', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '4px 8px' }}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ fontSize: '0.95rem', fontWeight: '500' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Join Free</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
