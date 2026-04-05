/**
 * @fileoverview Global error handling middleware
 * @module middleware/errorHandler
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { config } from '../config/env';

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} _next - Express next function
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  /* Log error with detailed context */
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
    statusCode,
  });

  /* Send error response */
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });

  /* Exit process for non-operational errors in production */
  if (!isOperational && config.NODE_ENV === 'production') {
    logger.error('Non-operational error detected. Shutting down...');
    process.exit(1);
  }
};

/**
 * Handle 404 not found errors
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
