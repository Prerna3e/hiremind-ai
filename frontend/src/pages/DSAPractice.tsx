import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, ChevronRight, Brain, Sparkles, 
    Code, Play, Send, Zap, BookOpen, Clock, 
    Trophy, Flame, Bookmark, ChevronLeft, Terminal,
    Lightbulb, Info, FileCode, CheckCircle2
} from 'lucide-react';
import FuturisticLayout from '../components/FuturisticLayout';
import robotAvatar from '../assets/robot-avatar.png';

interface Question {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    acceptance: string;
    status: 'Solved' | 'Unsolved' | 'Attempted';
}

const questions: Question[] = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', acceptance: '49.5%', status: 'Solved' },
    { id: 2, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'Strings', acceptance: '33.8%', status: 'Attempted' },
    { id: 3, title: 'LRU Cache', difficulty: 'Medium', category: 'Linked List', acceptance: '40.2%', status: 'Unsolved' },
    { id: 4, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack & Queue', acceptance: '40.5%', status: 'Solved' },
    { id: 5, title: 'Merge Intervals', difficulty: 'Medium', category: 'Arrays', acceptance: '45.1%', status: 'Unsolved' },
    { id: 6, title: 'Word Search', difficulty: 'Medium', category: 'Backtracking', acceptance: '39.8%', status: 'Unsolved' },
    { id: 7, title: 'Trapping Rain Water', difficulty: 'Hard', category: 'Arrays', acceptance: '58.2%', status: 'Attempted' },
    { id: 8, title: 'Alien Dictionary', difficulty: 'Hard', category: 'Graphs', acceptance: '35.1%', status: 'Unsolved' }
];

const DSAPractice: React.FC = () => {
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [code, setCode] = useState('// Your code here...');

    const categories = ['Arrays', 'Strings', 'Linked List', 'Stack & Queue', 'Trees', 'Graphs', 'DP', 'Backtracking'];

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return '#22c55e';
            case 'Medium': return '#f59e0b';
            case 'Hard': return '#ef4444';
            default: return 'white';
        }
    };

    return (
        <FuturisticLayout>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                
                {selectedQuestion ? (
                    // ═══════════════════════════════════════════════════════════
                    // DETAIL VIEW
                    // ═══════════════════════════════════════════════════════════
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {/* Header & Back Button */}
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
                                <div className="glass" style={{ padding: '8px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Clock size={14} color="var(--accent-gold)" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>00:45:12</span>
                                </div>
                                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><Bookmark size={20} /></button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            {/* Left: Problem Description */}
                            <div className="glass" style={{ padding: '40px', borderRadius: '30px', height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                                <div style={{ marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <span style={{ background: `${getDifficultyColor(selectedQuestion.difficulty)}15`, color: getDifficultyColor(selectedQuestion.difficulty), padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>{selectedQuestion.difficulty.toUpperCase()}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>ID: #{selectedQuestion.id} • ACCEPTANCE: {selectedQuestion.acceptance}</span>
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem', color: 'white', fontFamily: 'var(--font-futuristic)', letterSpacing: '1px', marginBottom: '20px' }}>{selectedQuestion.title}</h2>
                                    
                                    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem' }}>
                                        <p style={{ marginBottom: '20px' }}>Given an array of integers <code style={{ color: 'var(--accent-cyan)', background: 'rgba(6,214,199,0.1)', padding: '2px 6px', borderRadius: '4px' }}>nums</code> and an integer <code style={{ color: 'var(--accent-cyan)', background: 'rgba(6,214,199,0.1)', padding: '2px 6px', borderRadius: '4px' }}>target</code>, return indices of the two numbers such that they add up to target.</p>
                                        <p style={{ marginBottom: '20px' }}>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                                        
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                                            <div style={{ fontWeight: 800, color: 'white', fontSize: '0.8rem', marginBottom: '10px' }}>EXAMPLE 1:</div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                                                <div style={{ color: 'var(--text-muted)' }}>Input: <span style={{ color: 'white' }}>nums = [2,7,11,15], target = 9</span></div>
                                                <div style={{ color: 'var(--text-muted)' }}>Output: <span style={{ color: 'white' }}>[0,1]</span></div>
                                                <div style={{ color: 'var(--text-muted)' }}>Explanation: <span style={{ color: 'white' }}>Because nums[0] + nums[1] == 9, we return [0, 1].</span></div>
                                            </div>
                                        </div>

                                        <div style={{ fontWeight: 800, color: 'white', fontSize: '0.8rem', marginBottom: '10px' }}>CONSTRAINTS:</div>
                                        <ul style={{ listStyle: 'none', paddingLeft: '0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <li style={{ marginBottom: '8px' }}>• 2 ≤ nums.length ≤ 10⁴</li>
                                            <li style={{ marginBottom: '8px' }}>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                                            <li style={{ marginBottom: '8px' }}>• -10⁹ ≤ target ≤ 10⁹</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* AI Assistance Panel */}
                                <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                        <div className="robot-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--accent-cyan)' }}>
                                            <img src={robotAvatar} style={{ width: '100%', borderRadius: '50%' }} alt="AI" />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-futuristic)' }}>NEURAL ASSISTANT ACTIVATED</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <button className="glass" style={{ padding: '15px', borderRadius: '15px', textAlign: 'left', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                                <Lightbulb size={16} color="var(--accent-gold)" />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>GET HINT</span>
                                            </div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Step-by-step guidance without giving away the solution.</p>
                                        </button>
                                        <button className="glass" style={{ padding: '15px', borderRadius: '15px', textAlign: 'left', border: '1px solid var(--border)', cursor: 'pointer' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                                <Brain size={16} color="var(--accent-purple)" />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>SHOW APPROACH</span>
                                            </div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Brute-force to optimal (O(n)) time complexity.</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Code Editor & Execution */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="glass" style={{ flex: 1, borderRadius: '30px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ padding: '15px 25px', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <select style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.75rem', outline: 'none' }}>
                                                <option>Python 3</option>
                                                <option>JavaScript (ES6)</option>
                                                <option>Java 17</option>
                                                <option>C++</option>
                                            </select>
                                        </div>
                                        <Info size={14} color="var(--text-muted)" />
                                    </div>
                                    <textarea 
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        style={{ 
                                            flex: 1, background: '#050810', border: 'none', color: '#94A3B8', 
                                            padding: '30px', fontFamily: 'var(--font-mono)', fontSize: '0.95rem',
                                            outline: 'none', resize: 'none', lineHeight: 1.6
                                        }}
                                    />
                                    <div style={{ padding: '20px 30px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                                        <button style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'white', padding: '10px 25px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Play size={16} /> RUN
                                        </button>
                                        <button className="btn-primary" style={{ padding: '10px 30px', borderRadius: '12px', fontWeight: 900, background: 'var(--accent-blue)', cursor: 'pointer', border: 'none', color: 'white', fontFamily: 'var(--font-futuristic)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                            SUBMIT SOLUTION
                                        </button>
                                    </div>
                                </div>

                                {/* Results / Console */}
                                <div className="glass" style={{ height: '200px', borderRadius: '25px', padding: '25px' }}>
                                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '5px' }}>CONSOLE</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>TEST CASES</span>
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                        <div style={{ color: 'var(--accent-cyan)' }}>[SYSTEM]: Ready for execution.</div>
                                        <div>Waiting for run command...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // ═══════════════════════════════════════════════════════════
                    // LIST VIEW
                    // ═══════════════════════════════════════════════════════════
                    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
                        
                        {/* Sidebar: Categories & Progress */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div className="glass" style={{ padding: '25px', borderRadius: '25px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '20px', fontFamily: 'var(--font-futuristic)' }}>PATH PROGRESS</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-mono)' }}>25<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/75</span></div>
                                        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 800 }}>33% COMPLETE</div>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <motion.div animate={{ width: '33%' }} style={{ height: '100%', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue)' }} />
                                    </div>
                                </div>
                                <div style={{ marginTop: '25px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--accent-gold)' }}><Flame size={20} /></div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>5 Day Streak! 🔥</div>
                                </div>
                            </div>

                            <nav className="glass" style={{ padding: '15px', borderRadius: '25px' }}>
                                <div style={{ padding: '15px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>CATEGORIES</div>
                                {categories.map((cat, i) => (
                                    <button 
                                        key={i}
                                        style={{ 
                                            width: '100%', padding: '12px 15px', borderRadius: '12px', background: 'transparent',
                                            border: 'none', color: 'var(--text-secondary)', textAlign: 'left', cursor: 'pointer',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        {cat}
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>0/8</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Main Content: Question List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h1 style={{ fontSize: '2rem', color: 'white', fontFamily: 'var(--font-futuristic)', letterSpacing: '1px' }}>
                                    TOP 75 <span style={{ color: 'var(--accent-cyan)' }}>CODING CHALLENGES</span>
                                </h1>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', top: '12px', left: '15px', color: 'var(--text-muted)' }} />
                                        <input 
                                            placeholder="Search problem..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ 
                                                background: 'var(--bg-tertiary)', border: '1px solid var(--border)', 
                                                borderRadius: '12px', padding: '10px 15px 10px 45px', color: 'white',
                                                outline: 'none', width: '250px'
                                            }}
                                        />
                                    </div>
                                    <button className="glass" style={{ padding: '0 15px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        <Filter size={16} /> Difficulty
                                    </button>
                                </div>
                            </div>

                            <div className="glass" style={{ borderRadius: '30px', overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 120px 120px 60px', padding: '20px 30px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>
                                    <span>#</span>
                                    <span>TITLE</span>
                                    <span>DIFFICULTY</span>
                                    <span>CATEGORY</span>
                                    <span>ACCEPTANCE</span>
                                    <span>STATUS</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {questions.map((q, i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                                            onClick={() => setSelectedQuestion(q)}
                                            style={{ 
                                                display: 'grid', gridTemplateColumns: '40px 1fr 120px 120px 120px 60px', 
                                                padding: '20px 30px', alignItems: 'center', borderTop: '1px solid var(--border)', cursor: 'pointer'
                                            }}
                                        >
                                            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{q.id}</span>
                                            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{q.title}</span>
                                            <span style={{ color: getDifficultyColor(q.difficulty), fontSize: '0.8rem', fontWeight: 900 }}>{q.difficulty}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{q.category}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{q.acceptance}</span>
                                            <span style={{ fontSize: '0.7rem' }}>
                                                {q.status === 'Solved' ? <CheckCircle2 size={18} color="#22c55e" /> : 
                                                 q.status === 'Attempted' ? <Clock size={18} color="#f59e0b" /> : 
                                                 <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--border)' }} />}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginTop: '20px' }}>
                                {[
                                    { icon: <Trophy color="var(--accent-gold)" />, label: "Master Builder", desc: "Solve 50 problems" },
                                    { icon: <Zap color="var(--accent-cyan)" />, label: "Speed Demon", desc: "Submit in < 15 mins" },
                                    { icon: <BookOpen color="var(--accent-purple)" />, label: "The Librarian", desc: "Bookmark 20 problems" }
                                ].map((badge, i) => (
                                    <div key={i} className="glass" style={{ padding: '25px', borderRadius: '25px', display: 'flex', gap: '20px', alignItems: 'center', opacity: 0.5 }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {badge.icon}
                                        </div>
                                        <div>
                                            <div style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>{badge.label}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{badge.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FuturisticLayout>
    );
};

export default DSAPractice;
