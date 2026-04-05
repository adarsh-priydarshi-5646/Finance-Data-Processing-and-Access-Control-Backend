/**
 * @fileoverview Dashboard service for analytics and reporting
 * @module services/dashboard
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { FinancialRecordRepository } from '../repositories/financialRecord.repository';
import { IDashboardSummary, ICategoryBreakdown, IMonthlyTrend, IFinancialRecord } from '../types';

/* Simple in-memory cache */
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; /* 5 minutes */

/**
 * Dashboard service class
 */
export class DashboardService {
  private recordRepository: FinancialRecordRepository;

  constructor() {
    this.recordRepository = new FinancialRecordRepository();
  }

  /**
   * Get cached data or fetch new
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function to fetch data
   * @returns {Promise<T>} Cached or fresh data
   */
  private async getCached<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
    const data = await fetchFn();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Get dashboard summary
   * @returns {Promise<IDashboardSummary>} Summary statistics
   */
  async getSummary(): Promise<IDashboardSummary> {
    return this.getCached('summary', () => this.recordRepository.getSummary());
  }

  /**
   * Get category breakdown
   * @returns {Promise<ICategoryBreakdown>} Category breakdown
   */
  async getCategoryBreakdown(): Promise<ICategoryBreakdown> {
    return this.getCached('categoryBreakdown', () => this.recordRepository.getCategoryBreakdown());
  }

  /**
   * Get recent activity
   * @param {number} limit - Number of records
   * @returns {Promise<IFinancialRecord[]>} Recent records
   */
  async getRecentActivity(limit: number = 10): Promise<IFinancialRecord[]> {
    return this.recordRepository.getRecentRecords(limit);
  }

  /**
   * Get monthly trends
   * @returns {Promise<IMonthlyTrend[]>} Monthly trends
   */
  async getMonthlyTrends(): Promise<IMonthlyTrend[]> {
    return this.recordRepository.getMonthlyTrends();
  }

  /**
   * Get full dashboard data
   * @returns {Promise<object>} Complete dashboard data
   */
  async getFullDashboard(): Promise<{
    summary: IDashboardSummary;
    categoryBreakdown: ICategoryBreakdown;
    recentActivity: IFinancialRecord[];
    monthlyTrends: IMonthlyTrend[];
  }> {
    const [summary, categoryBreakdown, recentActivity, monthlyTrends] = await Promise.all([
      this.getSummary(),
      this.getCategoryBreakdown(),
      this.getRecentActivity(5),
      this.getMonthlyTrends(),
    ]);

    return {
      summary,
      categoryBreakdown,
      recentActivity,
      monthlyTrends,
    };
  }
}
