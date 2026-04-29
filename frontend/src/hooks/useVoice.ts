import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVoiceReturn {
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string) => void;
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

    // Track transcript in ref for auto-submit callback
    useEffect(() => {
        latestTranscriptRef.current = transcript;
    }, [transcript]);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log('Speech recognition service started');
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            const combined = (finalTranscript + interimTranscript).trim();
            if (combined) {
                setTranscript(combined);
                latestTranscriptRef.current = combined;
                console.log('Voice capture:', combined);
            }

            // Auto-submit after 3 seconds of silence if transcript is meaningful
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (combined.length > 5 && onAutoSubmit) {
                silenceTimerRef.current = setTimeout(() => {
                    if (latestTranscriptRef.current.trim().length > 5) {
                        console.log('Auto-submitting voice answer...');
                        onStartSpeaking(); // Stop any current synthesis
                        onAutoSubmit(latestTranscriptRef.current);
                    }
                }, 3000);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error, event.message);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow mic access.');
            }
            if (event.error !== 'no-speech') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            console.log('Speech recognition service ended');
            // Auto-restart if we're supposed to be listening
            if (isListening) {
                console.log('Auto-restarting mic...');
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Auto-restart failed, setting isListening to false');
                    setIsListening(false);
                }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            // Don't auto-restart when unmounting
            recognition.onend = null; 
            try { recognition.stop(); } catch { /* ignore */ }
        };
    }, [isListening]); // added isListening to deps so the closure has the latest value

    const startListening = useCallback(() => {
        console.log('Mic Activation Attempted. Engine Ready:', !!recognitionRef.current, 'Already Listening:', isListening);
        if (!recognitionRef.current || isListening) return;
        try {
            setTranscript('');
            recognitionRef.current.start();
        } catch (err) {
            console.warn('Failed to start recognition:', err);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current) return;
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        try {
            recognitionRef.current.stop();
        } catch { /* ignore */ }
    }, []);

    const speak = useCallback((text: string) => {
        // Stop listening while AI speaks
        stopListening();
        window.speechSynthesis.cancel();

        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);

        // Try to pick a natural English voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
            (v) =>
                v.lang.startsWith('en') &&
                (v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('samantha') ||
                    v.name.toLowerCase().includes('zira') ||
                    v.name.toLowerCase().includes('google'))
        );
        utterance.voice = preferred || voices.find((v) => v.lang.startsWith('en')) || voices[0];
        utterance.rate = 1.0;
        utterance.pitch = 1.05;

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [stopListening]);

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
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
