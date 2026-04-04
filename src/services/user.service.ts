/**
 * @fileoverview User service for user management logic
 * @module services/user
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { UserRepository } from '../repositories/user.repository';
import { IUser, UserRole, UserStatus } from '../types';

/**
 * User service class
 */
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get all users
   * @returns {Promise<IUser[]>} Array of users
   */
  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<IUser>} User document
   */
  async getUserById(id: string): Promise<IUser> {
    return this.userRepository.findById(id);
  }

  /**
   * Update user status
   * @param {string} id - User ID
   * @param {UserStatus} status - New status
   * @returns {Promise<IUser>} Updated user
   */
  async updateUserStatus(id: string, status: UserStatus): Promise<IUser> {
    return this.userRepository.updateStatus(id, status);
  }

  /**
   * Update user role
   * @param {string} id - User ID
   * @param {UserRole} role - New role
   * @returns {Promise<IUser>} Updated user
   */
  async updateUserRole(id: string, role: UserRole): Promise<IUser> {
    return this.userRepository.updateRole(id, role);
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
