/**
 * @fileoverview User request validators
 * @module validators/user
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { body, param } from 'express-validator';
import { UserRole, UserStatus } from '../types';

export const updateStatusValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('status').isIn(Object.values(UserStatus)).withMessage('Invalid status'),
];

export const updateRoleValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role').isIn(Object.values(UserRole)).withMessage('Invalid role'),
];

export const userIdValidator = [param('id').isMongoId().withMessage('Invalid user ID')];
