/**
 * @fileoverview Type definitions and interfaces for the Finance Backend application
 * @module types
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request } from 'express';
import { Document } from 'mongoose';

/**
 * User role enumeration
 */
export enum UserRole {
  VIEWER = 'viewer',
  ANALYST = 'analyst',
  ADMIN = 'admin',
}

/**
 * User status enumeration
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * Transaction type enumeration
 */
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

/**
 * User document interface extending Mongoose Document
 */
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Financial record document interface
 */
export interface IFinancialRecord extends Document {
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * JWT payload interface
 */
export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Authenticated request interface
 */
export interface IAuthRequest extends Request {
  user?: IJwtPayload;
}

/**
 * API response interface
 */
export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Pagination query interface
 */
export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Financial record filter interface
 */
export interface IRecordFilter extends IPaginationQuery {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Dashboard summary interface
 */
export interface IDashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalRecords: number;
}

/**
 * Category breakdown interface
 */
export interface ICategoryBreakdown {
  income: Record<string, { total: number; count: number }>;
  expense: Record<string, { total: number; count: number }>;
}

/**
 * Monthly trend interface
 */
export interface IMonthlyTrend {
  month: string;
  income: number;
  expense: number;
  net: number;
}
