import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const FuturisticLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <main style={{ 
                flex: 1, 
                marginLeft: 0, 
                display: 'flex', 
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0
            }}>
                {/* Top Bar */}
                <header style={{
                    height: '80px',
                    padding: isMobile ? '0 20px' : '0 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(2, 4, 8, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                        >
                            <LayoutDashboard size={20} />
                        </button>
                        <h1 style={{ fontFamily: 'var(--font-futuristic)', fontSize: isMobile ? '0.8rem' : '1rem', color: 'white', letterSpacing: '2px' }}>
                            {isMobile ? 'HIREMIND' : 'NEURAL INTERVIEW SYSTEM'}
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px' }}>

                        <div style={{ width: '1px', height: '30px', background: 'var(--border)' }}></div>
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                className="glass neon-border" 
                                style={{ 
                                    width: '40px', height: '40px', borderRadius: '12px', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    color: showSettingsMenu ? 'var(--accent-cyan)' : 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <Settings size={18} />
                            </button>
                            {/* ... settings menu remains same ... */}

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
                <div style={{ flex: 1, position: 'relative', padding: '20px 0', overflowX: 'hidden' }}>
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
