/**
 * @fileoverview Financial Record model schema and methods
 * @module models/FinancialRecord
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import mongoose, { Schema } from 'mongoose';
import { IFinancialRecord, TransactionType } from '../types';

/**
 * Financial Record schema definition
 */
const financialRecordSchema = new Schema<IFinancialRecord>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      minlength: [2, 'Category must be at least 2 characters'],
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Indexes for optimized queries
 */
financialRecordSchema.index({ userId: 1, date: -1 });
financialRecordSchema.index({ type: 1, category: 1 });
financialRecordSchema.index({ date: -1 });

/**
 * Transform output
 */
financialRecordSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const result: Record<string, unknown> = { ...ret };
    result.id = result._id;
    delete result._id;
    return result;
  },
});

export const FinancialRecord = mongoose.model<IFinancialRecord>(
  'FinancialRecord',
  financialRecordSchema
);
