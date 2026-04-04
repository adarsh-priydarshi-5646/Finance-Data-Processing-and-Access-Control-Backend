/**
 * @fileoverview Authentication controller for handling auth requests
 * @module controllers/auth
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { UserRole } from '../types';

const authService = new AuthService();

/**
 * Register new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;

  const { user, token } = await authService.register(
    email,
    password,
    name,
    role || UserRole.VIEWER
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token },
  });
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, token },
  });
});
