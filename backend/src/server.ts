import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import speechRoutes from './routes/speechRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
    message: {
        message: 'Too many requests from this IP, please try again later.',
    },
});

app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/speech', speechRoutes);

// Health Check Route
app.get('/', (req: Request, res: Response) => {
    res.send('HireMind AI API is running 🚀');
});

// Global Error Handler
app.use(
    (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(`[Error]: ${err.stack}`);

        const statusCode = err.statusCode || 500;

        res.status(statusCode).json({
            message: err.message || 'Internal Server Error',
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }
);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 HireMind AI Server running on port ${PORT}`);
});