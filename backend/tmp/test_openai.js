import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const testOpenAI = async () => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: 'Say hello' }],
            model: 'gpt-3.5-turbo',
        });
        console.log('OpenAI SUCCESS:', completion.choices[0].message.content);
        process.exit(0);
    } catch (err) {
        console.error('OpenAI ERROR:', err.message);
        process.exit(1);
    }
};

testOpenAI();
