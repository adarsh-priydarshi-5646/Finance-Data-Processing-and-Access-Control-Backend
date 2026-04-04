/**
 * @fileoverview Financial Record service for record management logic
 * @module services/financialRecord
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { FinancialRecordRepository } from '../repositories/financialRecord.repository';
import { IFinancialRecord, IRecordFilter } from '../types';
import { BadRequestError } from '../utils/errors';

/**
 * Financial Record service class
 */
export class FinancialRecordService {
  private recordRepository: FinancialRecordRepository;

  constructor() {
    this.recordRepository = new FinancialRecordRepository();
  }

  /**
   * Get all records with filters
   * @param {IRecordFilter} filters - Filter options
   * @returns {Promise<IFinancialRecord[]>} Array of records
   */
  async getAllRecords(filters: IRecordFilter = {}): Promise<IFinancialRecord[]> {
    return this.recordRepository.findAll(filters);
  }

  /**
   * Get record by ID
   * @param {string} id - Record ID
   * @returns {Promise<IFinancialRecord>} Financial record
   */
  async getRecordById(id: string): Promise<IFinancialRecord> {
    return this.recordRepository.findById(id);
  }

  /**
   * Create new record
   * @param {Partial<IFinancialRecord>} recordData - Record data
   * @returns {Promise<IFinancialRecord>} Created record
   */
  async createRecord(recordData: Partial<IFinancialRecord>): Promise<IFinancialRecord> {
    if (recordData.amount && recordData.amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    return this.recordRepository.create(recordData);
  }

  /**
   * Update record
   * @param {string} id - Record ID
   * @param {Partial<IFinancialRecord>} updateData - Update data
   * @returns {Promise<IFinancialRecord>} Updated record
   */
  async updateRecord(id: string, updateData: Partial<IFinancialRecord>): Promise<IFinancialRecord> {
    if (updateData.amount && updateData.amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    return this.recordRepository.update(id, updateData);
  }

  /**
   * Delete record
   * @param {string} id - Record ID
   * @returns {Promise<void>}
   */
  async deleteRecord(id: string): Promise<void> {
    await this.recordRepository.delete(id);
  }
}
