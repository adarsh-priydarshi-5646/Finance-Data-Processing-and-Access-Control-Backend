/**
 * @fileoverview Financial Record routes
 * @module routes/financialRecord
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Router } from 'express';
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/financialRecord.controller';
import {
  createRecordValidator,
  updateRecordValidator,
  recordIdValidator,
  recordFilterValidator,
} from '../validators/financialRecord.validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

/* All routes require authentication */
router.use(authenticate);

/**
 * @route GET /api/records
 * @desc Get all records with filters
 * @access Private
 */
router.get('/', validate(recordFilterValidator), getAllRecords);

/**
 * @route GET /api/records/:id
 * @desc Get record by ID
 * @access Private
 */
router.get('/:id', validate(recordIdValidator), getRecordById);

/**
 * @route POST /api/records
 * @desc Create new record
 * @access Private (Analyst, Admin)
 */
router.post(
  '/',
  authorize(UserRole.ANALYST, UserRole.ADMIN),
  validate(createRecordValidator),
  createRecord
);

/**
 * @route PUT /api/records/:id
 * @desc Update record
 * @access Private (Admin)
 */
router.put('/:id', authorize(UserRole.ADMIN), validate(updateRecordValidator), updateRecord);

/**
 * @route DELETE /api/records/:id
 * @desc Delete record
 * @access Private (Admin)
 */
router.delete('/:id', authorize(UserRole.ADMIN), validate(recordIdValidator), deleteRecord);

export default router;
