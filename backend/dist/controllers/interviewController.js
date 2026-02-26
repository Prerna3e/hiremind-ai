import Interview from '../models/Interview.js';
import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const startInterview = async (req, res) => {
    const { role, experienceLevel, techStack, interviewType } = req.body;
    try {
        const prompt = `Generate 5 technical interview questions for a ${role} position. 
    Experience Level: ${experienceLevel}. 
    Tech Stack: ${techStack.join(', ')}. 
    Interview Type: ${interviewType}.
    Return the response as a JSON array of strings.`;
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: 'gpt-3.5-turbo', // Or gpt-4
            response_format: { type: 'json_object' },
        });
        const content = completion.choices[0].message.content;
        const questionsRes = JSON.parse(content || '{"questions": []}');
        const questions = questionsRes.questions.map((q) => ({ question: q }));
        const interview = await Interview.create({
            user: req.user._id,
            role,
            experienceLevel,
            techStack,
            interviewType,
            questions,
        });
        res.status(201).json(interview);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const submitAnswer = async (req, res) => {
    const { interviewId, questionIndex, answer } = req.body;
    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        interview.questions[questionIndex].answer = answer;
        // AI feedback for single answer
        const prompt = `Evaluate the following interview answer.
    Question: ${interview.questions[questionIndex].question}
    Answer: ${answer}
    Provide feedback and a score out of 10. Return as JSON with keys "feedback" and "score".`;
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
        });
        const aiRes = JSON.parse(completion.choices[0].message.content || '{}');
        interview.questions[questionIndex].feedback = aiRes.feedback;
        interview.questions[questionIndex].score = aiRes.score;
        await interview.save();
        res.json(interview);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const evaluateInterview = async (req, res) => {
    const { interviewId } = req.params;
    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        const conversation = interview.questions.map(q => `Q: ${q.question}\nA: ${q.answer}\nScore: ${q.score}/10`).join('\n\n');
        const prompt = `Analyze this full interview and provide a comprehensive evaluation.
    ${conversation}
    
    Return a JSON object with:
    - communicationScore (0-100)
    - technicalScore (0-100)
    - confidenceScore (0-100)
    - overallScore (0-100)
    - strengths (array of strings)
    - weaknesses (array of strings)
    - suggestions (array of strings)
    - summary (string)`;
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
        });
        const evaluation = JSON.parse(completion.choices[0].message.content || '{}');
        interview.evaluation = evaluation;
        interview.status = 'completed';
        await interview.save();
        res.json(interview);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getInterviews = async (req, res) => {
    const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
};
const getAllCandidates = async (req, res) => {
    const interviews = await Interview.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(interviews);
};
export { startInterview, submitAnswer, evaluateInterview, getInterviews, getAllCandidates };
