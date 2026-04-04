/**
 * @fileoverview User controller for handling user management requests
 * @module controllers/user
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

const userService = new UserService();

/**
 * Get all users
 * @route GET /api/users
 * @access Private (Admin)
 */
export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private (Admin)
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Update user status
 * @route PATCH /api/users/:id/status
 * @access Private (Admin)
 */
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const user = await userService.updateUserStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    data: user,
  });
});

/**
 * Update user role
 * @route PATCH /api/users/:id/role
 * @access Private (Admin)
 */
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await userService.updateUserRole(req.params.id, role);

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: user,
  });
});

/**
 * Delete user
 * @route DELETE /api/users/:id
 * @access Private (Admin)
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
