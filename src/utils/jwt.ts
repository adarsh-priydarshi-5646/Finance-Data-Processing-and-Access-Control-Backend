/**
 * @fileoverview JWT utility functions for token generation and verification
 * @module utils/jwt
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { IJwtPayload } from '../types';
import { UnauthorizedError } from './errors';

/**
 * Generate JWT token
 * @param {IJwtPayload} payload - Token payload
 * @returns {string} Generated JWT token
 */
export const generateToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE } as jwt.SignOptions);
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {IJwtPayload} Decoded token payload
 * @throws {UnauthorizedError} If token is invalid
 */
export const verifyToken = (token: string): IJwtPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as IJwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};
