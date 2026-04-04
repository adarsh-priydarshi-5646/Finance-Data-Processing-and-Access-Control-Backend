/**
 * @fileoverview Financial Record controller for handling record requests
 * @module controllers/financialRecord
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Response } from 'express';
import { FinancialRecordService } from '../services/financialRecord.service';
import { asyncHandler } from '../utils/asyncHandler';
import { IAuthRequest, IRecordFilter, TransactionType } from '../types';

const recordService = new FinancialRecordService();

/**
 * Get all records
 * @route GET /api/records
 * @access Private
 */
export const getAllRecords = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const filters: IRecordFilter = {
    type: req.query.type as TransactionType | undefined,
    category: req.query.category as string | undefined,
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
  };

  const records = await recordService.getAllRecords(filters);

  res.status(200).json({
    success: true,
    data: records,
  });
});

/**
 * Get record by ID
 * @route GET /api/records/:id
 * @access Private
 */
export const getRecordById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const record = await recordService.getRecordById(req.params.id);

  res.status(200).json({
    success: true,
    data: record,
  });
});

/**
 * Create new record
 * @route POST /api/records
 * @access Private (Analyst, Admin)
 */
export const createRecord = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const recordData = {
    ...req.body,
    userId: req.user!.id,
  };

  const record = await recordService.createRecord(recordData);

  res.status(201).json({
    success: true,
    message: 'Record created successfully',
    data: record,
  });
});

/**
 * Update record
 * @route PUT /api/records/:id
 * @access Private (Admin)
 */
export const updateRecord = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const record = await recordService.updateRecord(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Record updated successfully',
    data: record,
  });
});

/**
 * Delete record
 * @route DELETE /api/records/:id
 * @access Private (Admin)
 */
export const deleteRecord = asyncHandler(async (req: IAuthRequest, res: Response) => {
  await recordService.deleteRecord(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Record deleted successfully',
  });
});
