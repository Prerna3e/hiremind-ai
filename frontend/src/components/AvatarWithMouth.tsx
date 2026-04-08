import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AvatarWithMouth = ({ isSpeaking, analyser, dataArray, persona }: { isSpeaking: boolean, analyser: AnalyserNode | null, dataArray: Uint8Array | null, persona: 'Sarah' | 'Alex' }) => {
    const [mouthOpen, setMouthOpen] = useState(0); // 0 to 1
    const animRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = () => {
            if (analyser && dataArray && isSpeaking) {
                analyser.getByteFrequencyData(dataArray as any);

                // get average volume from speech frequencies only (80-3000hz range)
                const speechRange = dataArray.slice(2, 15);
                const avg = speechRange.reduce((a, b) => a + b, 0) / speechRange.length;

                // normalize to 0-1, clamp it
                const normalized = Math.min(Math.max(avg / 120, 0), 1);

                // smooth it out so mouth doesnt flicker
                setMouthOpen(prev => prev * 0.6 + normalized * 0.4);
            } else {
                // smoothly close mouth when not speaking
                setMouthOpen(prev => prev * 0.85);
            }
            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        }
    }, [analyser, dataArray, isSpeaking]);

    // mouth height based on volume — min 2px, max 18px
    const mouthHeight = 2 + mouthOpen * 18;
    const mouthWidth = 28 + mouthOpen * 8;

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#000" }}>

            <AnimatePresence mode="wait">
                <motion.img
                    key={persona}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    src={persona === 'Sarah' ? "/avatar_female.png" : "/avatar_male.png"}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    alt={`AI ${persona}`}
                />
            </AnimatePresence>

            {/* MOUTH OVERLAY — positioned precisely on the face */}
            <div
                style={{
                    position: "absolute",
                    top: persona === 'Sarah' ? "64%" : "67%",        // Adjusted for specific avatars
                    left: persona === 'Sarah' ? "49.5%" : "50%",      // Adjusted for horizontal center
                    transform: "translateX(-50%)",
                    width: `${mouthWidth}px`,
                    height: `${mouthHeight}px`,
                    backgroundColor: "#1a0a0a",  // dark mouth interior
                    borderRadius: `${mouthHeight}px / ${mouthHeight / 2}px`,
                    transition: "height 0.05s ease, width 0.05s ease",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    zIndex: 5
                }}
            >
                {/* teeth strip — only visible when open */}
                {mouthOpen > 0.15 && (
                    <div style={{
                        width: "85%",
                        height: "40%",
                        backgroundColor: "#f0ece0",
                        borderRadius: "0 0 4px 4px",
                        marginTop: "1px"
                    }} />
                )}
            </div>

            {/* LIP LINES — upper and lower lip curves */}
            <div style={{
                position: "absolute",
                top: `calc(${persona === 'Sarah' ? "64%" : "67%"} - ${mouthHeight / 2 + 3}px)`,
                left: persona === 'Sarah' ? "49.5%" : "50%",
                transform: "translateX(-50%)",
                width: `${mouthWidth + 8}px`,
                height: "4px",
                background: "rgba(0,0,0,0.15)",
                borderRadius: "50%",
                zIndex: 4
            }} />
            <div style={{
                position: "absolute",
                top: `calc(${persona === 'Sarah' ? "64%" : "67%"} + ${mouthHeight / 2}px)`,
                left: persona === 'Sarah' ? "49.5%" : "50%",
                transform: "translateX(-50%)",
                width: `${mouthWidth + 4}px`,
                height: "3px",
                background: "rgba(0,0,0,0.12)",
                borderRadius: "50%",
                zIndex: 4
            }} />

        </div>
    );
};

export default AvatarWithMouth;
