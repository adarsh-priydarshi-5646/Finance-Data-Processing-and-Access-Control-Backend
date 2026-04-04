/**
 * @fileoverview Request validation middleware using express-validator
 * @module middleware/validation
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors';

/**
 * Validate request using express-validator
 * @param {ValidationChain[]} validations - Array of validation chains
 * @returns {Function} Express middleware function
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    /* Execute all validations */
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
    }));

    throw new ValidationError(JSON.stringify(extractedErrors));
  };
};
