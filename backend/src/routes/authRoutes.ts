import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Input Sanitization Schema
const registerSchema = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).escape(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['candidate', 'recruiter']).withMessage('Invalid role'),
];

const loginSchema = [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerSchema, registerUser);
router.post('/login', loginSchema, loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
