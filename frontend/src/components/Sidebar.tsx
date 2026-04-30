import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    FileText, 
    HelpCircle, 
    LogOut,
    Home
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: <MessageSquare size={20} />, label: "Mock Interview", path: "/interview" },
        { icon: <FileText size={20} />, label: "Resume Analysis", path: "/resume" },
        { icon: <HelpCircle size={20} />, label: "HR Questions", path: "/hr" },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Holographic Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            width: '280px',
                            background: 'rgba(5, 8, 16, 0.95)',
                            backdropFilter: 'blur(30px)',
                            borderRight: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'fixed',
                            top: 0,
                            bottom: 0,
                            zIndex: 1000,
                            padding: '30px 20px',
                            boxShadow: '20px 0 50px rgba(0,0,0,0.8)'
                        }}
                    >
                        <div style={{ marginBottom: '40px', padding: '0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ 
                                fontFamily: 'var(--font-futuristic)', 
                                fontSize: '1.2rem', 
                                color: 'white', 
                                letterSpacing: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <div style={{ width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-cyan)' }}></div>
                                HIREMIND.AI
                            </h2>
                            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>
                                &times;
                            </button>
                        </div>

                        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link
                                to="/dashboard"
                                onClick={onClose}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '14px 20px',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    color: location.pathname === '/dashboard' ? 'white' : 'var(--text-secondary)',
                                    background: location.pathname === '/dashboard' ? 'rgba(59, 123, 246, 0.1)' : 'transparent',
                                    border: location.pathname === '/dashboard' ? '1px solid rgba(59, 123, 246, 0.2)' : '1px solid transparent',
                                    transition: 'all 0.3s ease',
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                }}
                            >
                                <span style={{ color: location.pathname === '/dashboard' ? 'var(--accent-blue)' : 'inherit' }}><Home size={20} /></span>
                                Dashboard
                            </Link>

                            {menuItems.map((item, i) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={i}
                                        to={item.path}
                                        onClick={onClose}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            padding: '14px 20px',
                                            borderRadius: '16px',
                                            textDecoration: 'none',
                                            color: isActive ? 'white' : 'var(--text-secondary)',
                                            background: isActive ? 'rgba(59, 123, 246, 0.1)' : 'transparent',
                                            border: isActive ? '1px solid rgba(59, 123, 246, 0.2)' : '1px solid transparent',
                                            transition: 'all 0.3s ease',
                                            fontWeight: 600,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <span style={{ color: isActive ? 'var(--accent-blue)' : 'inherit' }}>{item.icon}</span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div style={{ marginTop: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button 
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '14px 20px',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    color: '#ef4444',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    transition: 'all 0.3s ease',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left'
                                }}
                            >
                                <LogOut size={20} />
                                Logout & Exit
                            </button>
                            <div className="glass" style={{ padding: '15px', borderRadius: '15px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ 
                                        width: '40px', height: '40px', borderRadius: '12px', 
                                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: 'white', fontSize: '1rem'
                                    }}>
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                                        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>USER</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 900
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
