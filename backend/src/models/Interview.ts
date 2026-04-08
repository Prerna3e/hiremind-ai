import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    feedback: {
        positive: String,
        improvement: String,
    },
    scoreDelta: {
        technical: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
    },
    score: Number,
});

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: String,
        experienceLevel: String,
        techStack: [String],
        interviewType: {
            type: String,
            enum: ['technical', 'hr', 'mixed'],
            default: 'mixed',
        },
        companyType: {
            type: String,
            default: 'Startup',
        },
        numberOfQuestions: {
            type: Number,
            default: 10,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium',
        },
        currentQuestionIndex: {
            type: Number,
            default: 0,
        },
        scores: {
            technical: { type: Number, default: 50 },
            communication: { type: Number, default: 50 },
            confidence: { type: Number, default: 50 },
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending',
        },
        questions: [questionSchema],
        evaluation: {
            communicationScore: Number,
            technicalScore: Number,
            confidenceScore: Number,
            overallScore: Number,
            strengths: [String],
            weaknesses: [String],
            opportunities: [String],
            threats: [String],
            topDoneWell: [String],
            topToImprove: [String],
            suggestedResources: [String],
            summary: String,
        },
    },
    {
        timestamps: true,
    }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
