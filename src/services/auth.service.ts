/**
 * @fileoverview Authentication service for user authentication logic
 * @module services/auth
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { UserRepository } from '../repositories/user.repository';
import { IUser, UserRole } from '../types';
import { generateToken } from '../utils/jwt';
import { UnauthorizedError, ConflictError, ForbiddenError } from '../utils/errors';

/**
 * Authentication service class
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @param {UserRole} role - User role
   * @returns {Promise<object>} User and token
   */
  async register(
    email: string,
    password: string,
    name: string,
    role: UserRole = UserRole.VIEWER
  ): Promise<{ user: IUser; token: string }> {
    const emailExists = await this.userRepository.emailExists(email);

    if (emailExists) {
      throw new ConflictError('Email already registered');
    }

    const user = await this.userRepository.create({
      email,
      password,
      name,
      role,
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} User and token
   */
  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status === 'inactive') {
      throw new ForbiddenError('Account is inactive');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    /* Remove password from response */
    const userObject = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userObject;

    return { user: userWithoutPassword as IUser, token };
  }
}
