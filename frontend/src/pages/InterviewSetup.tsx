import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight, CheckCircle2, Briefcase, Code2, Users, Target,
    Sparkles, Gauge
} from 'lucide-react';
import type { InterviewSetupData } from '../hooks/useInterview';

interface InterviewSetupProps {
    setupData: InterviewSetupData;
    setSetupData: React.Dispatch<React.SetStateAction<InterviewSetupData>>;
    onStart: () => Promise<void>;
    loading: boolean;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ setupData, setSetupData, onStart, loading }) => {
    const [setupStep, setSetupStep] = React.useState(1);
    const [selectedTechs, setSelectedTechs] = React.useState<string[]>([]);

    const roleOptions = [
        'Frontend Engineer',
        'Backend Engineer',
        'Full Stack Engineer',
        'DevOps / SRE',
        'Data Engineer',
        'ML / AI Engineer',
    ];

    const techOptions = [
        'React', 'Node.js', 'TypeScript', 'Python', 'Java',
        'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
    ];

    const toggleTech = (tech: string) => {
        const updated = selectedTechs.includes(tech)
            ? selectedTechs.filter(t => t !== tech)
            : [...selectedTechs, tech];
        setSelectedTechs(updated);
        setSetupData(prev => ({ ...prev, techStack: updated.join(', ') }));
    };

    const interviewTypes = [
        { value: 'technical' as const, label: 'Technical', icon: <Code2 size={22} />, desc: 'DSA, System Design, Coding' },
        { value: 'hr' as const, label: 'Behavioral / HR', icon: <Users size={22} />, desc: 'Culture fit, Leadership, STAR' },
        { value: 'mixed' as const, label: 'Mixed', icon: <Sparkles size={22} />, desc: 'Best of both — most realistic' },
    ];

    const difficulties = [
        { value: 'easy' as const, label: 'Easy', color: '#22c55e', desc: 'Foundational questions, encouraging tone' },
        { value: 'medium' as const, label: 'Medium', color: '#f59e0b', desc: 'Balanced mix, probes for depth' },
        { value: 'hard' as const, label: 'Hard', color: '#ef4444', desc: 'Advanced topics, challenges every answer' },
    ];

    const questionCounts = [5, 10, 15];

    const experienceLevels = ['Junior / Entry', 'Intermediate / Mid', 'Senior / Expert', 'Staff / Principal'];

    return (
        <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="full-width-container"
            style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}
        >
            {/* Progress Steps */}
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '12px', marginBottom: '64px'
            }}>
                {[1, 2, 3].map(i => (
                    <React.Fragment key={i}>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: setupStep === i ? 'var(--accent-blue)' : setupStep > i ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: setupStep === i ? 'var(--shadow-glow-blue)' : 'none',
                                transition: 'all 0.3s ease', cursor: 'pointer',
                            }}
                            onClick={() => { if (i < setupStep) setSetupStep(i); }}
                        >
                            {setupStep > i ? (
                                <CheckCircle2 size={18} color="#050810" />
                            ) : (
                                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{i}</span>
                            )}
                        </motion.div>
                        {i < 3 && (
                            <div style={{
                                width: '60px', height: '2px',
                                background: setupStep > i ? 'var(--accent-cyan)' : 'var(--border)',
                                transition: 'background 0.3s ease',
                            }} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="glass" style={{
                padding: '56px', borderRadius: '32px', position: 'relative',
                borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
                {/* Step 1: Role & Experience */}
                {setupStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
                            borderRadius: '100px', background: 'rgba(59, 123, 246, 0.1)',
                            border: '1px solid rgba(59, 123, 246, 0.3)', marginBottom: '16px',
                        }}>
                            <Briefcase size={12} color="var(--accent-blue)" />
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Step 01 — Define Your Profile
                            </span>
                        </div>

                        <h2 style={{ fontSize: '2.2rem', marginTop: '12px', marginBottom: '40px', letterSpacing: '-0.03em' }}>
                            What role are you preparing for?
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                                <label style={labelStyle}>Target Role</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                    {roleOptions.map(role => (
                                        <motion.button
                                            key={role}
                                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59,123,246,0.1)' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSetupData(prev => ({ ...prev, role }))}
                                            style={{
                                                padding: '18px 15px',
                                                borderRadius: '20px',
                                                background: setupData.role === role ? 'rgba(59,123,246,0.1)' : 'var(--bg-secondary)',
                                                border: `1px solid ${setupData.role === role ? 'var(--accent-blue)' : 'var(--border)'}`,
                                                color: setupData.role === role ? 'white' : 'var(--text-secondary)',
                                                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
                                                transition: 'all 0.2s ease', textAlign: 'center',
                                            }}
                                        >
                                            {role}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Experience Level</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                                    {experienceLevels.map(level => (
                                        <motion.button
                                            key={level}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSetupData(prev => ({ ...prev, experienceLevel: level }))}
                                            style={{
                                                padding: '18px 10px', borderRadius: '20px',
                                                background: setupData.experienceLevel === level ? 'rgba(59,123,246,0.1)' : 'var(--bg-secondary)',
                                                border: `1px solid ${setupData.experienceLevel === level ? 'var(--accent-blue)' : 'var(--border)'}`,
                                                color: setupData.experienceLevel === level ? 'white' : 'var(--text-secondary)',
                                                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {level.split(' / ')[0]}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            {setupData.interviewType !== 'hr' && (
                                <div>
                                    <label style={labelStyle}>Tech Stack <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>— pick all that apply</span></label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {techOptions.map(tech => {
                                            const isSelected = selectedTechs.includes(tech);
                                            return (
                                                <motion.button
                                                    key={tech}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleTech(tech)}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: '100px',
                                                        background: isSelected ? 'rgba(6,214,199,0.12)' : 'var(--bg-secondary)',
                                                        border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border)'}`,
                                                        color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                                        cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: isSelected ? '0 0 10px rgba(6,214,199,0.15)' : 'none',
                                                    }}
                                                >
                                                    {isSelected ? '✓ ' : ''}{tech}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                    {selectedTechs.length === 0 && (
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
                                            Select at least one technology
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Interview Type */}
                {setupStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
                            borderRadius: '100px', background: 'rgba(6, 214, 199, 0.1)',
                            border: '1px solid rgba(6, 214, 199, 0.3)', marginBottom: '16px',
                        }}>
                            <Target size={12} color="var(--accent-cyan)" />
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Step 02 — Interview Format
                            </span>
                        </div>

                        <h2 style={{ fontSize: '2.2rem', marginTop: '12px', marginBottom: '40px', letterSpacing: '-0.03em' }}>
                            Choose your interview type
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                            {interviewTypes.map(type => (
                                <motion.button
                                    key={type.value}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setSetupData(prev => ({ ...prev, interviewType: type.value }))}
                                    style={{
                                        padding: '24px 28px', borderRadius: '20px',
                                        background: setupData.interviewType === type.value ? 'rgba(59,123,246,0.1)' : 'var(--bg-secondary)',
                                        border: `1px solid ${setupData.interviewType === type.value ? 'var(--accent-blue)' : 'var(--border)'}`,
                                        color: 'white', textAlign: 'left', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        transition: 'all 0.2s ease', position: 'relative',
                                    }}
                                >
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '14px',
                                        background: setupData.interviewType === type.value
                                            ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))'
                                            : 'var(--bg-tertiary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: setupData.interviewType === type.value ? '#050810' : 'var(--text-muted)',
                                        flexShrink: 0,
                                    }}>
                                        {type.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{type.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{type.desc}</div>
                                    </div>
                                    {setupData.interviewType === type.value && (
                                        <CheckCircle2 color="var(--accent-blue)" size={22}
                                            style={{ position: 'absolute', right: '24px' }} />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        <div>
                            <label style={labelStyle}>Number of Questions</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {questionCounts.map(count => (
                                    <button
                                        key={count}
                                        onClick={() => setSetupData(prev => ({ ...prev, numberOfQuestions: count }))}
                                        style={{
                                            flex: 1, padding: '18px', borderRadius: '16px',
                                            background: setupData.numberOfQuestions === count ? 'rgba(59,123,246,0.15)' : 'var(--bg-secondary)',
                                            border: `1px solid ${setupData.numberOfQuestions === count ? 'var(--accent-blue)' : 'var(--border)'}`,
                                            color: setupData.numberOfQuestions === count ? 'white' : 'var(--text-secondary)',
                                            cursor: 'pointer', fontWeight: 800, fontSize: '1.3rem',
                                            fontFamily: 'var(--font-mono)', transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Difficulty */}
                {setupStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
                            borderRadius: '100px', background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '16px',
                        }}>
                            <Gauge size={12} color="var(--accent-purple)" />
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Step 03 — Calibrate Difficulty
                            </span>
                        </div>

                        <h2 style={{ fontSize: '2.2rem', marginTop: '12px', marginBottom: '40px', letterSpacing: '-0.03em' }}>
                            How tough do you want it?
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                            {difficulties.map(d => (
                                <motion.button
                                    key={d.value}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setSetupData(prev => ({ ...prev, difficulty: d.value }))}
                                    style={{
                                        padding: '24px 28px', borderRadius: '20px',
                                        background: setupData.difficulty === d.value ? `${d.color}15` : 'var(--bg-secondary)',
                                        border: `1px solid ${setupData.difficulty === d.value ? d.color : 'var(--border)'}`,
                                        color: 'white', textAlign: 'left', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        transition: 'all 0.2s ease', position: 'relative',
                                    }}
                                >
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '14px',
                                        background: setupData.difficulty === d.value ? d.color : 'var(--bg-tertiary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, fontSize: '1.2rem',
                                        color: setupData.difficulty === d.value ? '#050810' : 'var(--text-muted)',
                                        flexShrink: 0,
                                    }}>
                                        {d.value === 'easy' ? '★' : d.value === 'medium' ? '★★' : '★★★'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{d.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.desc}</div>
                                    </div>
                                    {setupData.difficulty === d.value && (
                                        <CheckCircle2 color={d.color} size={22} style={{ position: 'absolute', right: '24px' }} />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Summary Card */}
                        <div style={{
                            padding: '24px', borderRadius: '16px',
                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                        }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Interview Summary
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Role:</span> <span style={{ fontWeight: 700 }}>{setupData.role}</span></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Level:</span> <span style={{ fontWeight: 700 }}>{setupData.experienceLevel}</span></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{setupData.interviewType}</span></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Questions:</span> <span style={{ fontWeight: 700 }}>{setupData.numberOfQuestions}</span></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Navigation Buttons */}
                <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {setupStep > 1 && (
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                className="btn-secondary"
                                onClick={() => setSetupStep(s => s - 1)}
                                style={{ flex: 1, height: '56px', fontSize: '1rem' }}
                            >
                                Back
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={!((setupStep === 1 && (!setupData.role || !setupData.experienceLevel || (setupData.interviewType !== 'hr' && setupData.techStack.length === 0))) ||
                                          (setupStep === 2 && (!setupData.interviewType || !setupData.numberOfQuestions)) ||
                                          (setupStep === 3 && !setupData.difficulty)) ? { scale: 1.02 } : {}}
                            whileTap={!((setupStep === 1 && (!setupData.role || !setupData.experienceLevel || (setupData.interviewType !== 'hr' && setupData.techStack.length === 0))) ||
                                          (setupStep === 2 && (!setupData.interviewType || !setupData.numberOfQuestions)) ||
                                          (setupStep === 3 && !setupData.difficulty)) ? { scale: 0.97 } : {}}
                            className="btn-primary"
                            onClick={() => {
                                if (setupStep === 1) {
                                    if (!setupData.role || !setupData.experienceLevel) return;
                                    if (setupData.interviewType !== 'hr' && setupData.techStack.length === 0) return;
                                }
                                if (setupStep === 2) {
                                    if (!setupData.interviewType || !setupData.numberOfQuestions) return;
                                }
                                setupStep < 3 ? setSetupStep(setupStep + 1) : onStart();
                            }}
                            disabled={loading || 
                                (setupStep === 1 && (!setupData.role || !setupData.experienceLevel || (setupData.interviewType !== 'hr' && setupData.techStack.length === 0))) ||
                                (setupStep === 2 && (!setupData.interviewType || !setupData.numberOfQuestions)) ||
                                (setupStep === 3 && !setupData.difficulty)
                            }
                            style={{
                                flex: 2, height: '60px', fontSize: '1.1rem',
                                background: setupStep === 3
                                    ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
                                    : 'var(--accent-blue)',
                                boxShadow: setupStep === 3 ? '0 8px 32px rgba(139, 92, 246, 0.3)' : 'var(--shadow-glow-blue)',
                                opacity: ((setupStep === 1 && (!setupData.role || !setupData.experienceLevel || (setupData.interviewType !== 'hr' && setupData.techStack.length === 0))) ||
                                          (setupStep === 2 && (!setupData.interviewType || !setupData.numberOfQuestions)) ||
                                          (setupStep === 3 && !setupData.difficulty)) ? 0.5 : 1,
                                cursor: ((setupStep === 1 && (!setupData.role || !setupData.experienceLevel || (setupData.interviewType !== 'hr' && setupData.techStack.length === 0))) ||
                                         (setupStep === 2 && (!setupData.interviewType || !setupData.numberOfQuestions)) ||
                                         (setupStep === 3 && !setupData.difficulty)) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
                                    />
                                    Generating your interview...
                                </div>
                            ) : setupStep < 3 ? (
                                <>Continue <ChevronRight size={20} /></>
                            ) : (
                                <>Start Interview with Maya <Sparkles size={20} /></>
                            )}
                        </motion.button>
                    </div>
                    {setupStep === 1 && (!setupData.role || !setupData.experienceLevel || (setupData.interviewType !== 'hr' && setupData.techStack.length === 0)) && (
                        <p style={{ color: '#ef4444', fontSize: '0.75rem', textAlign: 'center', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {!setupData.role ? 'Please select a target role' : 
                             !setupData.experienceLevel ? 'Please select an experience level' :
                             'Please select at least one tech stack'}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', display: 'block',
};

export default InterviewSetup;
