import { Request, Response } from 'express';
import Interview from '../models/Interview.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const startInterview = async (req: any, res: Response) => {
    const { role, experienceLevel, techStack, interviewType } = req.body;
    let questionsRes;

    try {
        const prompt = `You are HireMind AI, a professional technical interviewer. 
        Generate 5 CHALLENGING but CONVERSATIONAL technical interview questions for a ${role} position. 
        Experience Level: ${experienceLevel}. 
        Tech Stack: ${techStack.join(', ')}. 
        
        CRITICAL: The questions will be spoken aloud by a text-to-speech system. 
        - Keep them natural, like a human speaking.
        - Avoid long, complex sentences.
        - Use phrases like "Alright, let's look at...", "Interesting, how would you...", "Great, now for the next part...".
        
        Return the response EXACTLY in this JSON format:
        {
            "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"]
        }`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        questionsRes = JSON.parse(content || '{"questions": []}');
    } catch (error: any) {
        console.error('OpenAI Start Interview Error (Fallback active):', error.message);
        questionsRes = {
            questions: [
                `Alright, let's start with your background. Could you explain your core experience with ${techStack.join(', ')}?`,
                `Great! In a ${role} role, how do you usually approach solving complex architectural problems?`,
                `Interesting. Tell me, what are some common pitfalls you've encountered when working with ${techStack[0]}?`,
                `That's a good point. How do you stay updated with the latest trends in the tech stack you use?`,
                `Alright, one last technical one. Describe a time you had to optimize a slow application. What was your process?`
            ]
        };
    }

    try {
        const questions = questionsRes.questions.map((q: string) => ({ question: q }));

        const interview = await Interview.create({
            user: req.user._id,
            role,
            experienceLevel,
            techStack,
            interviewType,
            questions,
        });

        res.status(201).json(interview);
    } catch (dbError: any) {
        res.status(500).json({ message: dbError.message });
    }
};

const submitAnswer = async (req: any, res: Response) => {
    const { interviewId, questionIndex, answer } = req.body;
    let aiRes;

    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        try {
            const prompt = `You are a technical recruiter. Evaluate the following interview answer.
            Question: ${interview.questions[questionIndex].question}
            Answer: ${answer}
            
            Provide constructive feedback and a score out of 10. 
            Return EXACTLY as JSON with keys:
            {
                "feedback": "your feedback here",
                "score": 8
            }`;

            const completion = await openai.chat.completions.create({
                messages: [{ role: 'system', content: prompt }],
                model: 'gpt-3.5-turbo',
                response_format: { type: 'json_object' },
            });

            aiRes = JSON.parse(completion.choices[0].message.content || '{}');
        } catch (openaiErr: any) {
            console.error('OpenAI Submit Answer Error (Fallback active):', openaiErr.message);
            aiRes = {
                feedback: "Good response. (Simulation mode active due to API constraints).",
                score: 8
            };
        }

        interview.questions[questionIndex].answer = answer;
        interview.questions[questionIndex].feedback = aiRes.feedback;
        interview.questions[questionIndex].score = aiRes.score;

        await interview.save();
        res.json(interview);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const evaluateInterview = async (req: any, res: Response) => {
    const { interviewId } = req.params;
    let evaluation;

    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const conversation = interview.questions.map(q =>
            `Q: ${q.question}\nA: ${q.answer}\nScore: ${q.score}/10`
        ).join('\n\n');

        try {
            const prompt = `Analyze this full technical interview and provide a comprehensive evaluation.
            Review all questions and answers:
            ${conversation}
            
            Return a JSON object with EXACTLY these keys:
            {
                "communicationScore": 85,
                "technicalScore": 90,
                "confidenceScore": 80,
                "overallScore": 85,
                "strengths": ["list item 1", "list item 2"],
                "weaknesses": ["list item 1", "list item 2"],
                "suggestions": ["list item 1", "list item 2"],
                "summary": "a brief executive summary"
            }`;

            const completion = await openai.chat.completions.create({
                messages: [{ role: 'system', content: prompt }],
                model: 'gpt-3.5-turbo',
                response_format: { type: 'json_object' },
            });

            evaluation = JSON.parse(completion.choices[0].message.content || '{}');
        } catch (openaiErr: any) {
            console.error('OpenAI Evaluation Error (Fallback active):', openaiErr.message);
            evaluation = {
                communicationScore: 80,
                technicalScore: 75,
                confidenceScore: 85,
                overallScore: 80,
                strengths: ["Clear articulation", "Relevant examples"],
                weaknesses: ["Technical depth", "Confidence in edge cases"],
                suggestions: ["Study system design", "Practice more mocks"],
                summary: "Overall a solid performance. (Note: Simulation mode active)."
            };
        }

        interview.evaluation = evaluation;
        interview.status = 'completed';

        await interview.save();
        res.json(interview);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getInterviews = async (req: any, res: Response) => {
    const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
};

const getAllCandidates = async (req: any, res: Response) => {
    const interviews = await Interview.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(interviews);
};

export { startInterview, submitAnswer, evaluateInterview, getInterviews, getAllCandidates };
