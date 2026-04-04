/**
 * @fileoverview Health check controller
 * @module controllers/health
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Health check endpoint
 * @route GET /api/health
 * @access Public
 */
export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});
