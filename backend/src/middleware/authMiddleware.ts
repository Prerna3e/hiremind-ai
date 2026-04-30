import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

interface AuthRequest extends Request {
    user?: any;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (token === 'null' || token === 'undefined' || !token) {
                res.status(401).json({ message: 'Not authorized, no valid neural access token provided.' });
                return;
            }

            // SECURITY: JWT secret must NEVER be hardcoded
            if (!process.env.JWT_SECRET) {
                console.error("FATAL: JWT_SECRET not configured.");
                res.status(500).json({ message: 'Internal Server Configuration Error' });
                return;
            }

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                res.status(401).json({ message: 'Neural identity link failed. User not found.' });
                return;
            }
            next();
        } catch (error: any) {
            console.error(`Session verification error: ${error.name}: ${error.message}`);
            res.status(401).json({ message: 'Not authorized, session expired or invalid neural signature.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no neural access token.' });
    }
};

const recruiter = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'recruiter') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a recruiter. Elevation required.' });
    }
};

export { protect, recruiter };
