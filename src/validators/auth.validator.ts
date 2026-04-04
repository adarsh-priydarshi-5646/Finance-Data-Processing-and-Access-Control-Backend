/**
 * @fileoverview Authentication request validators
 * @module validators/auth
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { body } from 'express-validator';
import { UserRole } from '../types';

export const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('role').optional().isIn(Object.values(UserRole)).withMessage('Invalid role'),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
