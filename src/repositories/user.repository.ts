/**
 * @fileoverview User repository for database operations
 * @module repositories/user
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { User } from '../models/User.model';
import { IUser, UserRole, UserStatus } from '../types';
import { NotFoundError } from '../utils/errors';

/**
 * User repository class
 */
export class UserRepository {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<IUser | null>} User document or null
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('+password');
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<IUser>} User document
   * @throws {NotFoundError} If user not found
   */
  async findById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Find all users
   * @returns {Promise<IUser[]>} Array of user documents
   */
  async findAll(): Promise<IUser[]> {
    return User.find().sort({ createdAt: -1 });
  }

  /**
   * Create new user
   * @param {Partial<IUser>} userData - User data
   * @returns {Promise<IUser>} Created user document
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  /**
   * Update user status
   * @param {string} id - User ID
   * @param {UserStatus} status - New status
   * @returns {Promise<IUser>} Updated user document
   */
  async updateStatus(id: string, status: UserStatus): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Update user role
   * @param {string} id - User ID
   * @param {UserRole} role - New role
   * @returns {Promise<IUser>} Updated user document
   */
  async updateRole(id: string, role: UserRole): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email });
    return count > 0;
  }
}
