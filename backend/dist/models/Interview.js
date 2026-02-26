import mongoose from 'mongoose';
const questionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    feedback: String,
    score: Number,
});
const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: String,
    experienceLevel: String,
    techStack: [String],
    interviewType: String,
    status: {
        type: String,
        enum: ['pending', 'completed'],
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
        suggestions: [String],
        summary: String,
    },
}, {
    timestamps: true,
});
const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
