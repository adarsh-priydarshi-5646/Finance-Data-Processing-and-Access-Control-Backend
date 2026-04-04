/**
 * @fileoverview Financial Record request validators
 * @module validators/financialRecord
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { body, param, query } from 'express-validator';
import { TransactionType } from '../types';

export const createRecordValidator = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('type').isIn(Object.values(TransactionType)).withMessage('Invalid transaction type'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be 2-50 characters'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const updateRecordValidator = [
  param('id').isMongoId().withMessage('Invalid record ID'),
  ...createRecordValidator,
];

export const recordIdValidator = [param('id').isMongoId().withMessage('Invalid record ID')];

export const recordFilterValidator = [
  query('type')
    .optional()
    .isIn(Object.values(TransactionType))
    .withMessage('Invalid transaction type'),
  query('category').optional().trim(),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
