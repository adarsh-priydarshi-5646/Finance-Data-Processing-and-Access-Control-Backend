/**
 * @fileoverview User management routes
 * @module routes/user
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller';
import {
  updateStatusValidator,
  updateRoleValidator,
  userIdValidator,
} from '../validators/user.validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

/* All routes require authentication and admin role */
router.use(authenticate, authorize(UserRole.ADMIN));

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private (Admin)
 */
router.get('/', getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private (Admin)
 */
router.get('/:id', validate(userIdValidator), getUserById);

/**
 * @route PATCH /api/users/:id/status
 * @desc Update user status
 * @access Private (Admin)
 */
router.patch('/:id/status', validate(updateStatusValidator), updateUserStatus);

/**
 * @route PATCH /api/users/:id/role
 * @desc Update user role
 * @access Private (Admin)
 */
router.patch('/:id/role', validate(updateRoleValidator), updateUserRole);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private (Admin)
 */
router.delete('/:id', validate(userIdValidator), deleteUser);

export default router;
