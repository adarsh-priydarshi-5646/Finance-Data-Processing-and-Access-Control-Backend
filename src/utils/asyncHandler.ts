/**
 * @fileoverview Async handler wrapper for Express route handlers
 * @module utils/asyncHandler
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Type definition for async route handler
 */
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wrapper for async route handlers to catch errors
 * @param {AsyncFunction} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
