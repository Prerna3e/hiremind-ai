import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            background: isScrolled ? 'rgba(5, 8, 16, 0.8)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(20px)' : 'none',
            borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'white',
                        fontFamily: 'var(--font-main)',
                        letterSpacing: '-0.02em'
                    }}>
                        HireMind <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{
                                textDecoration: 'none',
                                color: location.pathname === '/dashboard' ? 'white' : 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'color 0.2s ease'
                            }}>
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '16px', borderLeft: '1px solid var(--border)' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</div>
                                    <div style={{ color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro Member</div>
                                </div>
                                <button onClick={handleLogout} style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
