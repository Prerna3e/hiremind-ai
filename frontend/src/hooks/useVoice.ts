import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVoiceReturn {
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string, persona?: string) => void;
    stopSpeaking: () => void;
    resetTranscript: () => void;
    isSupported: boolean;
}

export const useVoice = (onAutoSubmit?: (transcript: string) => void): UseVoiceReturn => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestTranscriptRef = useRef('');
    const isSubmittingRef = useRef(false);

    // removed buggy useEffect

    const isManualStopRef = useRef(false);

    const isListeningRef = useRef(false);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.log('Speech Recognition not supported');
            setIsSupported(false);
            return;
        }

        setIsSupported(true);
        if (recognitionRef.current) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            console.log('🎤 MIC ON');
            setIsListening(true);
            isListeningRef.current = true;
            isManualStopRef.current = false;
        };

        recognition.onresult = (event: any) => {
            let finalStr = '';
            let interimStr = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalStr += event.results[i][0].transcript;
                } else {
                    interimStr += event.results[i][0].transcript;
                }
            }

            // Sync with ref to persist final results
            if (finalStr) {
                latestTranscriptRef.current = (latestTranscriptRef.current + ' ' + finalStr).trim();
            }

            // Display current state (Final + what's being said now)
            const displayTranscript = (latestTranscriptRef.current + ' ' + interimStr).trim();
            console.log('📝 Current Voice Input:', displayTranscript);
            setTranscript(displayTranscript);

            // Auto-submit after 4s silence if meaningful data exists
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (displayTranscript.length > 5 && onAutoSubmit && !isSubmittingRef.current && !isSpeaking) {
                silenceTimerRef.current = setTimeout(() => {
                    const textToSubmit = displayTranscript;
                    console.log('🚀 Silence Timeout: Auto-Submitting:', textToSubmit);
                    stopListening();
                    onAutoSubmit(textToSubmit);
                }, 4000);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('❌ STT Error:', event.error);
            if (event.error === 'no-speech') return;
            if (event.error === 'not-allowed') {
                alert('Mic access denied. Enable it in browser settings.');
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            console.log('🛑 MIC OFF');
            if (isListeningRef.current && !isManualStopRef.current) {
                console.log('🔄 Restarting...');
                try { recognition.start(); } catch { /* ignore */ }
            } else {
                setIsListening(false);
                isListeningRef.current = false;
            }
        };

        recognitionRef.current = recognition;

        // Pre-load voices for SpeechSynthesis
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            recognition.onend = null;
            window.speechSynthesis.onvoiceschanged = null;
            try { recognition.stop(); } catch { /* ignore */ }
        };
    }, []); // No deps - init once

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;
        
        try {
            setTranscript('');
            latestTranscriptRef.current = '';
            isManualStopRef.current = false;
            isListeningRef.current = true; // Set this before start to trigger auto-restart logic if needed
            recognitionRef.current.start();
        } catch (err: any) {
            console.warn('Start recognition error:', err.message);
            if (err.message?.includes('already started')) {
                setIsListening(true);
                isListeningRef.current = true;
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (!recognitionRef.current) return;
        
        isManualStopRef.current = true;
        try {
            recognitionRef.current.stop();
        } catch (err) {
            console.warn('Stop recognition error:', err);
        }
        setIsListening(false);
    }, []);

    const currentAudioRef = useRef<HTMLAudioElement | null>(null);

    const speak = useCallback(async (text: string, persona: string = 'Alex') => {
        // Stop listening while AI speaks
        if (recognitionRef.current && isListening) {
            try { recognitionRef.current.stop(); } catch { /* ignore */ }
        }
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        window.speechSynthesis.cancel();
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
        }

        setIsSpeaking(true);

        try {
            const response = await fetch('http://localhost:5000/api/speech/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, persona })
            });

            if (!response.ok) throw new Error('Speech synthesis failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            currentAudioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };
            audio.onerror = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();
        } catch (error) {
            console.warn('ElevenLabs API failed, falling back to browser TTS:', error);
            const utterance = new SpeechSynthesisUtterance(text);

            // Pre-fetch voices
            window.speechSynthesis.getVoices();
            
            const selectVoice = () => {
                const vList = window.speechSynthesis.getVoices();
                return vList.find(v => 
                    v.lang.startsWith('en') && 
                    ['female', 'samantha', 'zira', 'victoria', 'google uk english female', 'microsoft hazel', 'microsoft zira'].some(name => v.name.toLowerCase().includes(name))
                ) || vList.find(v => v.lang.startsWith('en')) || vList[0];
            };

            utterance.voice = selectVoice();
            utterance.rate = 1.0;
            utterance.pitch = 1.1; // Slightly higher pitch for a more natural female tone if fallback is used

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = (err) => {
                console.error('SpeechSynthesis error:', err);
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        }
    }, [isListening]);

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
        }
        setIsSpeaking(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        latestTranscriptRef.current = '';
    }, []);

    return {
        isListening,
        isSpeaking,
        transcript,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        resetTranscript,
        isSupported,
    };
};
