import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Search, Brain, Sparkles, MessageSquare,
    Play, Zap, 
    Trophy, Flame, ChevronLeft, 
    Lightbulb, Info, FileText, CheckCircle2,
    Users, Target, Award, Heart
} from 'lucide-react';
import FuturisticLayout from '../components/FuturisticLayout';
import robotAvatar from '../assets/robot-avatar.png';

interface HRQuestion {
    id: number;
    title: string;
    category: 'Behavioral' | 'Situational' | 'Culture' | 'Personal';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    commonality: string;
    status: 'Ready' | 'Practiced' | 'Mastered';
}

const hrQuestions: HRQuestion[] = [
    { id: 1, title: 'Tell me about yourself and your background.', category: 'Personal', difficulty: 'Easy', commonality: '99%', status: 'Ready' },
    { id: 2, title: 'Why do you want to work at this company?', category: 'Culture', difficulty: 'Medium', commonality: '95%', status: 'Practiced' },
    { id: 3, title: 'Describe a time you handled a difficult conflict with a coworker.', category: 'Behavioral', difficulty: 'Hard', commonality: '85%', status: 'Ready' },
    { id: 4, title: 'What is your greatest professional achievement?', category: 'Personal', difficulty: 'Medium', commonality: '90%', status: 'Mastered' },
    { id: 5, title: 'How do you handle high-pressure situations and tight deadlines?', category: 'Situational', difficulty: 'Medium', commonality: '88%', status: 'Ready' },
    { id: 6, title: 'Where do you see yourself in five years?', category: 'Personal', difficulty: 'Medium', commonality: '92%', status: 'Practiced' },
    { id: 7, title: 'Tell me about a time you failed and how you handled it.', category: 'Behavioral', difficulty: 'Hard', commonality: '82%', status: 'Ready' },
    { id: 8, title: 'What are your salary expectations for this role?', category: 'Personal', difficulty: 'Medium', commonality: '95%', status: 'Ready' }
];

const HRQuestions: React.FC = () => {
    const [selectedQuestion, setSelectedQuestion] = useState<HRQuestion | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const categories = ['All', 'Behavioral', 'Situational', 'Culture', 'Personal'];

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return '#22c55e';
            case 'Medium': return '#f59e0b';
            case 'Hard': return '#ef4444';
            default: return 'white';
        }
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'Behavioral': return <Users size={16} />;
            case 'Situational': return <Target size={16} />;
            case 'Culture': return <Heart size={16} />;
            case 'Personal': return <FileText size={16} />;
            default: return <MessageSquare size={16} />;
        }
    };

    const filteredQuestions = hrQuestions.filter(q => 
        (activeTab === 'All' || q.category === activeTab) &&
        (q.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <FuturisticLayout>
            <div className="full-width-container">
                
                {selectedQuestion ? (
                    // ═══════════════════════════════════════════════════════════
                    // DETAIL VIEW
                    // ═══════════════════════════════════════════════════════════
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <button 
                                onClick={() => setSelectedQuestion(null)}
                                style={{ 
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', 
                                    color: 'white', padding: '10px 20px', borderRadius: '12px', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    fontWeight: 700, fontSize: '0.8rem'
                                }}
                            >
                                <ChevronLeft size={16} /> BACK TO LIST
                            </button>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <span style={{ background: 'rgba(59, 123, 246, 0.1)', color: 'var(--accent-blue)', padding: '8px 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid rgba(59,123,246,0.2)' }}>
                                    {selectedQuestion.category.toUpperCase()} PROTOCOL
                                </span>
                            </div>
                        </div>

                        <div className="grid-sidebar-right">
                            {/* Left: Question Analysis */}
                            <div className="glass" style={{ padding: '40px', borderRadius: '30px' }}>
                                <div style={{ marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <span style={{ background: `${getDifficultyColor(selectedQuestion.difficulty)}15`, color: getDifficultyColor(selectedQuestion.difficulty), padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>{selectedQuestion.difficulty.toUpperCase()}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>COMMONALITY: {selectedQuestion.commonality}</span>
                                    </div>
                                    <h2 style={{ fontSize: '2.2rem', color: 'white', fontFamily: 'var(--font-futuristic)', letterSpacing: '1px', marginBottom: '30px', lineHeight: 1.2 }}>{selectedQuestion.title}</h2>
                                    
                                    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                                        <div style={{ background: 'rgba(59, 123, 246, 0.05)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(59, 123, 246, 0.2)', marginBottom: '30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                                <Brain size={20} color="var(--accent-cyan)" />
                                                <h4 style={{ color: 'white', margin: 0, fontFamily: 'var(--font-futuristic)' }}>INTENT BEHIND THE QUESTION</h4>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '1rem' }}>The interviewer is looking for self-awareness, communication skills, and alignment with the role. They want to see how you structure your thoughts and whether you focus on professional growth and company impact.</p>
                                        </div>

                                        <h4 style={{ color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Sparkles size={18} color="var(--accent-gold)" /> THE PERFECT APPROACH (STAR METHOD)
                                        </h4>
                                        <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <li style={{ display: 'flex', gap: '15px' }}>
                                                <span style={{ color: 'var(--accent-blue)', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>[S]</span>
                                                <span><strong>Situation:</strong> Set the scene and provide context for a specific event.</span>
                                            </li>
                                            <li style={{ display: 'flex', gap: '15px' }}>
                                                <span style={{ color: 'var(--accent-blue)', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>[T]</span>
                                                <span><strong>Task:</strong> Describe what your responsibility was in that situation.</span>
                                            </li>
                                            <li style={{ display: 'flex', gap: '15px' }}>
                                                <span style={{ color: 'var(--accent-blue)', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>[A]</span>
                                                <span><strong>Action:</strong> Explain exactly what steps you took to address the situation.</span>
                                            </li>
                                            <li style={{ display: 'flex', gap: '15px' }}>
                                                <span style={{ color: 'var(--accent-blue)', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>[R]</span>
                                                <span><strong>Result:</strong> Share the outcomes of your actions (use metrics if possible).</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Right: AI Assistant & Practice */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div className="glass" style={{ padding: '30px', borderRadius: '25px', textAlign: 'center', border: '1px solid var(--accent-cyan)' }}>
                                    <div className="robot-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px', border: '2px solid var(--accent-cyan)', padding: '5px' }}>
                                        <img src={robotAvatar} style={{ width: '100%', borderRadius: '50%' }} alt="AI" />
                                    </div>
                                    <h3 style={{ color: 'white', fontFamily: 'var(--font-futuristic)', fontSize: '1rem', marginBottom: '10px' }}>MAYA AI ASSISTANT</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '25px' }}>I can help you simulate this question in a real-time voice environment.</p>
                                    <button className="btn-primary" style={{ width: '100%', borderRadius: '15px', padding: '15px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <Play size={18} fill="currentColor" /> START SIMULATION
                                    </button>
                                </div>

                                <div className="glass" style={{ padding: '25px', borderRadius: '25px' }}>
                                    <h4 style={{ color: 'white', fontSize: '0.8rem', marginBottom: '15px', fontWeight: 800 }}>PRO TIPS</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ color: 'var(--accent-gold)' }}><Lightbulb size={16} /></div>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Keep your response under 2 minutes.</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ color: 'var(--accent-blue)' }}><Info size={16} /></div>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tailor your answer to the company culture.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // ═══════════════════════════════════════════════════════════
                    // LIST VIEW
                    // ═══════════════════════════════════════════════════════════
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', color: 'white', fontFamily: 'var(--font-futuristic)', letterSpacing: '1px', marginBottom: '10px' }}>
                                    BEHAVIORAL <span style={{ color: 'var(--accent-cyan)' }}>MASTERY</span>
                                </h1>
                                <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Master the top HR questions with AI-guided frameworks.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={16} style={{ position: 'absolute', top: '12px', left: '15px', color: 'var(--text-muted)' }} />
                                    <input 
                                        placeholder="Search question..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ 
                                            background: 'var(--bg-tertiary)', border: '1px solid var(--border)', 
                                            borderRadius: '12px', padding: '10px 15px 10px 45px', color: 'white',
                                            outline: 'none', width: '300px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    style={{
                                        padding: '10px 24px', borderRadius: '100px',
                                        background: activeTab === cat ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                                        color: activeTab === cat ? 'white' : 'var(--text-muted)',
                                        border: '1px solid var(--border)', cursor: 'pointer',
                                        fontWeight: 800, fontSize: '0.75rem', transition: 'all 0.3s ease'
                                    }}
                                >
                                    {cat.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                            {filteredQuestions.map((q, i) => (
                                <motion.div
                                    key={i}
                                    layoutId={`q-${q.id}`}
                                    whileHover={{ y: -5, borderColor: 'var(--accent-blue)' }}
                                    onClick={() => setSelectedQuestion(q)}
                                    className="glass"
                                    style={{ 
                                        padding: '30px', borderRadius: '25px', cursor: 'pointer',
                                        border: '1px solid var(--border)', transition: 'all 0.3s ease',
                                        position: 'relative', overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div style={{ color: 'var(--accent-cyan)', background: 'rgba(6, 214, 199, 0.1)', padding: '8px', borderRadius: '12px' }}>
                                            {getCategoryIcon(q.category)}
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: getDifficultyColor(q.difficulty) }}>{q.difficulty.toUpperCase()}</span>
                                    </div>
                                    <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '20px', lineHeight: 1.4, fontWeight: 700 }}>{q.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>{q.category}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-gold)' }}>
                                            <Zap size={14} fill="currentColor" />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{q.commonality} common</span>
                                        </div>
                                    </div>
                                    
                                    {q.status === 'Mastered' && (
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', color: '#22c55e' }}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Achievements */}
                        <div className="grid-cols-4-responsive" style={{ marginTop: '20px' }}>
                            {[
                                { icon: <Trophy color="var(--accent-gold)" />, label: "Storyteller", val: "5/20" },
                                { icon: <Award color="var(--accent-purple)" />, label: "Self-Aware", val: "12/20" },
                                { icon: <Brain color="var(--accent-cyan)" />, label: "Quick Thinker", val: "8/20" },
                                { icon: <Flame color="#ef4444" />, label: "Hot Streak", val: "3 Days" }
                            ].map((stat, i) => (
                                <div key={i} className="glass" style={{ padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>{stat.label.toUpperCase()}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 900 }}>{stat.val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </FuturisticLayout>
    );
};

export default HRQuestions;
