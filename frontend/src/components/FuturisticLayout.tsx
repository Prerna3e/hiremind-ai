import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    MessageSquare, 
    FileText, 
    Code, 
    HelpCircle, 
    User,
    Settings,
    LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FuturisticLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);

    const sessionProgress = {
        '/dashboard': 25,
        '/interview': 50,
        '/resume': 75,
        '/hr': 100,
    }[location.pathname] ?? 0;

    const menuItems = [
        { icon: <MessageSquare size={20} />, label: "Mock Interview", path: "/interview" },
        { icon: <FileText size={20} />, label: "Resume Analysis", path: "/resume" },
        { icon: <HelpCircle size={20} />, label: "HR Questions", path: "/hr" },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Holographic Sidebar */}
            <aside style={{
                width: '280px',
                background: 'rgba(12, 18, 32, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(59, 123, 246, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                bottom: 0,
                zIndex: 100,
                padding: '30px 20px'
            }}>
                <div style={{ marginBottom: '40px', padding: '0 10px' }}>
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
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {menuItems.map((item, i) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={i}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '12px 20px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(6, 214, 199, 0.05)' : 'transparent',
                                    border: isActive ? '1px solid rgba(6, 214, 199, 0.2)' : '1px solid transparent',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                }}
                            >
                                <span style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit' }}>{item.icon}</span>
                                {item.label}
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-pill"
                                        style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-cyan)' }} 
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto', padding: '20px 0' }}>
                    <button 
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            width: '100%',
                            padding: '12px 20px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                    
                    <div className="glass" style={{ padding: '15px', marginTop: '20px', borderRadius: '15px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                                width: '35px', height: '35px', borderRadius: '10px', 
                                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', color: 'white', fontSize: '0.8rem'
                            }}>
                                {user?.name.charAt(0)}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                                <div style={{ color: 'var(--accent-gold)', fontSize: '0.65rem', fontWeight: 800 }}>PRO ACCESS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
                {/* Top Bar */}
                <header style={{
                    height: '80px',
                    padding: '0 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(5, 8, 16, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid var(--border)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-futuristic)', fontSize: '1rem', color: 'white', letterSpacing: '1px' }}>
                            AI INTERVIEW ASSISTANT
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>SESSION PROGRESS</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>{sessionProgress}%</div>
                            </div>
                            <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <motion.div
                                    animate={{ width: `${sessionProgress}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    style={{ height: '100%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}
                                />
                            </div>
                        </div>
                        <div style={{ width: '1px', height: '30px', background: 'var(--border)' }}></div>
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                className="glass" 
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '10px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    border: '1px solid var(--border)', 
                                    color: showSettingsMenu ? 'var(--accent-cyan)' : 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <Settings size={18} />
                            </button>

                            <AnimatePresence>
                                {showSettingsMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        style={{
                                            position: 'absolute',
                                            top: '50px',
                                            right: 0,
                                            width: '200px',
                                            background: 'rgba(12, 18, 32, 0.95)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '15px',
                                            padding: '10px',
                                            zIndex: 1000,
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowSettingsMenu(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '12px 15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <LogOut size={16} /> Logout Session
                                        </button>
                                        
                                        <div style={{ height: '1px', background: 'var(--border)', margin: '5px 0' }}></div>
                                        
                                        <div style={{ padding: '10px 15px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                                            Neural Identity: {user?.role}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ padding: '40px', flex: 1, position: 'relative' }}>
                    {/* Background Decorative Glows */}
                    <div style={{ position: 'fixed', top: '20%', right: '10%', width: '400px', height: '400px', background: 'rgba(59, 123, 246, 0.05)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
                    <div style={{ position: 'fixed', bottom: '10%', left: '30%', width: '300px', height: '300px', background: 'rgba(6, 214, 199, 0.05)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
                    
                    {children}
                </div>
            </main>
        </div>
    );
};

export default FuturisticLayout;
