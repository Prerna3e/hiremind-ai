import express from 'express';
import { ElevenLabsClient } from 'elevenlabs';

const router = express.Router();

// Sarah (HR): "EXAVITQu4vr4xnSDxMaL"
// Alex (Tech): "JBFqnCBsd6RMkjVDRZzb"

router.post('/speak', async (req: any, res: any) => {
    const { text, persona } = req.body;

    try {
        const client = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY
        });

        const voiceId = persona === 'Sarah' ? 'EXAVITQu4vr4xnSDxMaL' : 'JBFqnCBsd6RMkjVDRZzb';

        const audio = await client.textToSpeech.convert(voiceId, {
            output_format: "mp3_44100_128",
            text: text,
            model_id: "eleven_multilingual_v2",
        });

        res.set('Content-Type', 'audio/mpeg');
        audio.pipe(res);
    } catch (error: any) {
        console.error('ElevenLabs Error:', error.message);
        res.status(500).json({ message: 'Speech synthesis failed' });
    }
});

export default router;
