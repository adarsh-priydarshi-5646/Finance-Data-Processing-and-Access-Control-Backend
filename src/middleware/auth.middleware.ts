/**
 * @fileoverview Authentication and authorization middleware
 * @module middleware/auth
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Response, NextFunction } from 'express';
import { IAuthRequest, UserRole } from '../types';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Authentication middleware to verify JWT token
 * @param {IAuthRequest} req - Express request with user
 * @param {Response} _res - Express response
 * @param {NextFunction} next - Express next function
 */
export const authenticate = asyncHandler(
  async (req: IAuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token || token.trim() === '') {
      throw new UnauthorizedError('Invalid token format');
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
);

/**
 * Authorization middleware to check user roles
 * @param {...UserRole[]} roles - Allowed roles
 * @returns {Function} Express middleware function
 */
export const authorize = (...roles: UserRole[]) => {
  return asyncHandler(
    async (req: IAuthRequest, _res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError('Insufficient permissions');
      }

      return next();
    }
  );
};
