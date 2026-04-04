/**
 * @fileoverview Financial Record repository for database operations
 * @module repositories/financialRecord
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { FinancialRecord } from '../models/FinancialRecord.model';
import { IFinancialRecord, IRecordFilter, TransactionType } from '../types';
import { NotFoundError } from '../utils/errors';

/**
 * Financial Record repository class
 */
export class FinancialRecordRepository {
  /**
   * Find all records with optional filters
   * @param {IRecordFilter} filters - Filter options
   * @returns {Promise<IFinancialRecord[]>} Array of financial records
   */
  async findAll(filters: IRecordFilter = {}): Promise<IFinancialRecord[]> {
    const query: Record<string, unknown> = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        (query.date as Record<string, unknown>).$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        (query.date as Record<string, unknown>).$lte = new Date(filters.endDate);
      }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    return FinancialRecord.find(query).sort({ date: -1 }).skip(skip).limit(limit);
  }

  /**
   * Find record by ID
   * @param {string} id - Record ID
   * @returns {Promise<IFinancialRecord>} Financial record document
   * @throws {NotFoundError} If record not found
   */
  async findById(id: string): Promise<IFinancialRecord> {
    const record = await FinancialRecord.findById(id);
    if (!record) {
      throw new NotFoundError('Financial record not found');
    }
    return record;
  }

  /**
   * Create new financial record
   * @param {Partial<IFinancialRecord>} recordData - Record data
   * @returns {Promise<IFinancialRecord>} Created record document
   */
  async create(recordData: Partial<IFinancialRecord>): Promise<IFinancialRecord> {
    const record = new FinancialRecord(recordData);
    return record.save();
  }

  /**
   * Update financial record
   * @param {string} id - Record ID
   * @param {Partial<IFinancialRecord>} updateData - Update data
   * @returns {Promise<IFinancialRecord>} Updated record document
   */
  async update(id: string, updateData: Partial<IFinancialRecord>): Promise<IFinancialRecord> {
    const record = await FinancialRecord.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      throw new NotFoundError('Financial record not found');
    }

    return record;
  }

  /**
   * Delete financial record
   * @param {string} id - Record ID
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    const record = await FinancialRecord.findByIdAndDelete(id);

    if (!record) {
      throw new NotFoundError('Financial record not found');
    }
  }

  /**
   * Get summary statistics
   * @returns {Promise<object>} Summary statistics
   */
  async getSummary(): Promise<{
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    totalRecords: number;
  }> {
    const result = await FinancialRecord.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', TransactionType.INCOME] }, '$amount', 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ['$type', TransactionType.EXPENSE] }, '$amount', 0],
            },
          },
          totalRecords: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return { totalIncome: 0, totalExpense: 0, netBalance: 0, totalRecords: 0 };
    }

    const { totalIncome, totalExpense, totalRecords } = result[0];
    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      totalRecords,
    };
  }

  /**
   * Get category breakdown
   * @returns {Promise<object>} Category breakdown
   */
  async getCategoryBreakdown(): Promise<{
    income: Record<string, { total: number; count: number }>;
    expense: Record<string, { total: number; count: number }>;
  }> {
    const result = await FinancialRecord.aggregate([
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income: Record<string, { total: number; count: number }> = {};
    const expense: Record<string, { total: number; count: number }> = {};

    result.forEach((item) => {
      const { type, category } = item._id;
      const data = { total: item.total, count: item.count };

      if (type === TransactionType.INCOME) {
        income[category] = data;
      } else {
        expense[category] = data;
      }
    });

    return { income, expense };
  }

  /**
   * Get recent records
   * @param {number} limit - Number of records to fetch
   * @returns {Promise<IFinancialRecord[]>} Recent records
   */
  async getRecentRecords(limit: number = 10): Promise<IFinancialRecord[]> {
    return FinancialRecord.find().sort({ date: -1, createdAt: -1 }).limit(limit);
  }

  /**
   * Get monthly trends
   * @returns {Promise<Array>} Monthly trends data
   */
  async getMonthlyTrends(): Promise<
    Array<{ month: string; income: number; expense: number; net: number }>
  > {
    const result = await FinancialRecord.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
      {
        $limit: 24,
      },
    ]);

    const monthlyData: Record<string, { income: number; expense: number }> = {};

    result.forEach((item) => {
      const monthKey = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (item._id.type === TransactionType.INCOME) {
        monthlyData[monthKey].income = item.total;
      } else {
        monthlyData[monthKey].expense = item.total;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
      }))
      .slice(0, 12);
  }
}
