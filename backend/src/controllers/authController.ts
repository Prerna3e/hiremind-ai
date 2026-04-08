import { Request, Response } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const generateToken = (id: string) => {
    // JWT secret MUST come from env. If not, the app should fail on startup.
    if (!process.env.JWT_SECRET) {
        throw new Error("CRITICAL: JWT_SECRET environment variable is missing.");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

const registerUser = async (req: Request, res: Response) => {
    // Collect errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Neural database initialization failed.' });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user: any = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            // Constant response time to prevent timing attacks
            res.status(401).json({ message: 'Invalid neural identity or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Authentication protocol error.' });
    }
};

const getUserProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Profile link lost.' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Neural profile retrieval failed.' });
    }
};

export { registerUser, loginUser, getUserProfile };
