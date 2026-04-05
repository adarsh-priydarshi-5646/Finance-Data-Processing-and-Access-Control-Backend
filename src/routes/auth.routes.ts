/**
 * @fileoverview Authentication routes
 * @module routes/auth
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { validate } from '../middleware/validation.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', authLimiter, validate(registerValidator), register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authLimiter, validate(loginValidator), login);

export default router;
