import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight, Download, RotateCcw, Plus, Sparkles, Target,
    TrendingUp, TrendingDown, AlertTriangle, BookOpen,
    Award, ThumbsUp, Lightbulb
} from 'lucide-react';
import type { Evaluation, Scores } from '../hooks/useInterview';

interface InterviewSummaryProps {
    evaluation: Evaluation;
    scores: Scores;
    setupData: { role: string; interviewType: string; difficulty: string };
    onRetry: () => void;
    onNewInterview: () => void;
    onGoToDashboard: () => void;
}

const InterviewSummary: React.FC<InterviewSummaryProps> = ({
    evaluation, scores: _scores, setupData, onRetry, onNewInterview, onGoToDashboard,
}) => {
    const isHire = evaluation.overallScore >= 70;

    const handleDownloadPDF = () => {
        // Generate a printable HTML report and trigger print/save as PDF
        const reportWindow = window.open('', '_blank');
        if (!reportWindow) return;

        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>HireMind AI — Interview Report</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
                    h1 { color: #1a1a1a; border-bottom: 3px solid #3B7BF6; padding-bottom: 12px; }
                    h2 { color: #3B7BF6; margin-top: 32px; }
                    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
                    .score-box { padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; }
                    .score-box .value { font-size: 2rem; font-weight: 800; }
                    .score-box .label { font-size: 0.8rem; color: #6b7280; text-transform: uppercase; }
                    .swot { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
                    .swot-box { padding: 16px; border-radius: 8px; }
                    .swot-box h3 { margin-bottom: 8px; }
                    .strengths { background: #f0fdf4; border: 1px solid #bbf7d0; }
                    .strengths h3 { color: #16a34a; }
                    .weaknesses { background: #fef2f2; border: 1px solid #fecaca; }
                    .weaknesses h3 { color: #dc2626; }
                    .opportunities { background: #eff6ff; border: 1px solid #bfdbfe; }
                    .opportunities h3 { color: #2563eb; }
                    .threats { background: #fefce8; border: 1px solid #fef08a; }
                    .threats h3 { color: #ca8a04; }
                    ul { padding-left: 20px; }
                    li { margin-bottom: 4px; }
                    .verdict { font-size: 1.5rem; font-weight: 800; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0; }
                    .hire { background: #f0fdf4; color: #16a34a; border: 2px solid #16a34a; }
                    .nohire { background: #fef2f2; color: #dc2626; border: 2px solid #dc2626; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <h1>🧠 HireMind AI — Interview Report</h1>
                <p><strong>Role:</strong> ${setupData.role} | <strong>Type:</strong> ${setupData.interviewType} | <strong>Difficulty:</strong> ${setupData.difficulty}</p>
                
                <div class="verdict ${isHire ? 'hire' : 'nohire'}">
                    ${isHire ? '✓ HIRE RECOMMENDATION' : '✗ NEEDS IMPROVEMENT'}
                </div>

                <div class="score-grid">
                    <div class="score-box"><div class="value">${evaluation.overallScore}</div><div class="label">Overall</div></div>
                    <div class="score-box"><div class="value">${evaluation.technicalScore}</div><div class="label">Technical</div></div>
                    <div class="score-box"><div class="value">${evaluation.communicationScore}</div><div class="label">Communication</div></div>
                    <div class="score-box"><div class="value">${evaluation.confidenceScore}</div><div class="label">Confidence</div></div>
                </div>

                <h2>Executive Summary</h2>
                <p>${evaluation.summary}</p>

                <h2>SWOT Analysis</h2>
                <div class="swot">
                    <div class="swot-box strengths"><h3>💪 Strengths</h3><ul>${evaluation.strengths?.map(s => `<li>${s}</li>`).join('') || ''}</ul></div>
                    <div class="swot-box weaknesses"><h3>⚠️ Weaknesses</h3><ul>${evaluation.weaknesses?.map(w => `<li>${w}</li>`).join('') || ''}</ul></div>
                    <div class="swot-box opportunities"><h3>🚀 Opportunities</h3><ul>${evaluation.opportunities?.map(o => `<li>${o}</li>`).join('') || ''}</ul></div>
                    <div class="swot-box threats"><h3>🛡️ Threats</h3><ul>${evaluation.threats?.map(t => `<li>${t}</li>`).join('') || ''}</ul></div>
                </div>

                <h2>Top 3 Things Done Well</h2>
                <ul>${evaluation.topDoneWell?.map(t => `<li>${t}</li>`).join('') || ''}</ul>

                <h2>Top 3 Things to Improve</h2>
                <ul>${evaluation.topToImprove?.map(t => `<li>${t}</li>`).join('') || ''}</ul>

                <h2>Suggested Resources</h2>
                <ul>${evaluation.suggestedResources?.map(r => `<li>${r}</li>`).join('') || ''}</ul>

                <p style="margin-top: 40px; color: #9ca3af; font-size: 0.8rem; text-align: center;">
                    Generated by HireMind AI — ${new Date().toLocaleDateString()}
                </p>
            </body>
            </html>
        `);

        reportWindow.document.close();
        setTimeout(() => reportWindow.print(), 500);
    };

    return (
        <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="full-width-container"
            style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}
        >
            {/* Verdict Banner */}
            <motion.div
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                className="glass neon-border"
                style={{
                    padding: '40px', borderRadius: '32px', textAlign: 'center', marginBottom: '32px',
                    background: isHire
                        ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.4), rgba(5, 150, 105, 0.4))'
                        : 'linear-gradient(135deg, rgba(69, 10, 10, 0.4), rgba(153, 27, 27, 0.4))',
                    backdropFilter: 'blur(30px)',
                    position: 'relative', overflow: 'hidden',
                }}
            >
                <div className="hologram-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}></div>
                <h1 style={{
                    fontSize: '3.5rem', fontWeight: 900, letterSpacing: '2px',
                    margin: 0, position: 'relative', color: 'white', fontFamily: 'var(--font-futuristic)'
                }}>
                    {isHire ? 'PASS' : 'RETRY'}
                </h1>
                <p style={{
                    fontSize: '1.2rem', color: isHire ? 'var(--accent-cyan)' : '#ef4444', 
                    marginTop: '15px', position: 'relative', fontWeight: 800, letterSpacing: '1px'
                }}>
                    {isHire ? 'VERDICT: ELITE CANDIDATE' : 'VERDICT: NEEDS SYSTEM OPTIMIZATION'}
                </p>
            </motion.div>

            <div className="interview-grid with-code">
                {/* Left Column — Scores */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Overall Score */}
                    <div className="glass" style={{ padding: '36px', textAlign: 'center', borderRadius: '28px' }}>
                        <div style={{
                            fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)',
                            marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em',
                        }}>
                            Overall Rating
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            style={{
                                fontSize: '5rem', fontWeight: 900, lineHeight: 1, color: 'white',
                                fontFamily: 'var(--font-mono)',
                            }}
                        >
                            {evaluation.overallScore}<span style={{ fontSize: '1.5rem', opacity: 0.4 }}>%</span>
                        </motion.div>
                        <div style={{
                            height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                            marginTop: '24px', overflow: 'hidden',
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${evaluation.overallScore}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))',
                                    borderRadius: '10px',
                                }}
                            />
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="glass" style={{ padding: '28px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>Score Breakdown</h3>
                        {[
                            { label: 'Technical', val: evaluation.technicalScore, color: 'var(--accent-blue)' },
                            { label: 'Communication', val: evaluation.communicationScore, color: 'var(--accent-cyan)' },
                            { label: 'Confidence', val: evaluation.confidenceScore, color: 'var(--accent-purple)' },
                        ].map((s, i) => (
                            <div key={s.label} style={{ marginBottom: '16px' }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px',
                                }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)' }}>{s.val}%</span>
                                </div>
                                <div style={{
                                    height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                                    overflow: 'hidden',
                                }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.val}%` }}
                                        transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                                        style={{ height: '100%', background: s.color, borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleDownloadPDF}
                            className="btn-secondary"
                            style={{
                                width: '100%', height: '48px', fontSize: '0.9rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                        >
                            <Download size={16} /> Download Report
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onRetry}
                            className="btn-secondary"
                            style={{
                                width: '100%', height: '48px', fontSize: '0.9rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                        >
                            <RotateCcw size={16} /> Retry Same Interview
                        </motion.button>
                    </div>
                </div>

                {/* Right Column — Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Summary */}
                    <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Sparkles color="var(--accent-gold)" size={20} />
                            <h3 style={{ fontSize: '1.2rem' }}>Executive Summary</h3>
                        </div>
                        <p style={{
                            fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)',
                        }}>
                            {evaluation.summary}
                        </p>
                    </div>

                    {/* Top 3 Done Well & Improve */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{
                            background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)',
                            padding: '24px', borderRadius: '20px',
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: '#22c55e', fontWeight: 800, marginBottom: '16px', fontSize: '0.8rem',
                            }}>
                                <ThumbsUp size={16} /> TOP 3 DONE WELL
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {evaluation.topDoneWell?.map((t, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                                        <Award size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: '3px' }} />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{
                            background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)',
                            padding: '24px', borderRadius: '20px',
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: '#f59e0b', fontWeight: 800, marginBottom: '16px', fontSize: '0.8rem',
                            }}>
                                <Lightbulb size={16} /> TOP 3 TO IMPROVE
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {evaluation.topToImprove?.map((t, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                                        <Target size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '3px' }} />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* SWOT Analysis */}
                    <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>SWOT Analysis</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                                { title: 'Strengths', items: evaluation.strengths, color: '#22c55e', icon: <TrendingUp size={16} />, bg: 'rgba(34,197,94,0.05)' },
                                { title: 'Weaknesses', items: evaluation.weaknesses, color: '#ef4444', icon: <TrendingDown size={16} />, bg: 'rgba(239,68,68,0.05)' },
                                { title: 'Opportunities', items: evaluation.opportunities, color: 'var(--accent-blue)', icon: <Sparkles size={16} />, bg: 'rgba(59,123,246,0.05)' },
                                { title: 'Threats', items: evaluation.threats, color: '#f59e0b', icon: <AlertTriangle size={16} />, bg: 'rgba(245,158,11,0.05)' },
                            ].map(section => (
                                <div key={section.title} style={{
                                    padding: '20px', borderRadius: '16px', background: section.bg,
                                    border: `1px solid ${section.color}15`,
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        color: section.color, fontWeight: 800, marginBottom: '12px',
                                        fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                                    }}>
                                        {section.icon} {section.title}
                                    </div>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {section.items?.map((item, i) => (
                                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                • {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggested Resources */}
                    <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            marginBottom: '16px',
                        }}>
                            <BookOpen size={18} color="var(--accent-cyan)" />
                            <h3 style={{ fontSize: '1.1rem' }}>Suggested Resources</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {evaluation.suggestedResources?.map((r, i) => (
                                <div key={i} style={{
                                    padding: '12px 16px', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                                    fontSize: '0.9rem', color: 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: 'var(--accent-blue)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.65rem', fontWeight: 900, color: '#050810', flexShrink: 0,
                                    }}>
                                        {i + 1}
                                    </div>
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onNewInterview}
                            className="btn-primary"
                            style={{
                                flex: 1, height: '56px', fontSize: '1rem', borderRadius: '16px',
                                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                            }}
                        >
                            <Plus size={18} /> New Interview
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onGoToDashboard}
                            className="btn-secondary"
                            style={{ flex: 1, height: '56px', fontSize: '1rem' }}
                        >
                            Dashboard <ChevronRight size={18} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InterviewSummary;
