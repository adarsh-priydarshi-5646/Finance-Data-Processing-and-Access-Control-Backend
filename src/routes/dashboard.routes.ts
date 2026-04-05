/**
 * @fileoverview Dashboard routes
 * @module routes/dashboard
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Router } from 'express';
import {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getMonthlyTrends,
  getFullDashboard,
} from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/* All routes require authentication */
router.use(authenticate);

/**
 * @route GET /api/dashboard
 * @desc Get full dashboard data
 * @access Private
 */
router.get('/', getFullDashboard);

/**
 * @route GET /api/dashboard/summary
 * @desc Get dashboard summary
 * @access Private
 */
router.get('/summary', getSummary);

/**
 * @route GET /api/dashboard/category-breakdown
 * @desc Get category breakdown
 * @access Private
 */
router.get('/category-breakdown', getCategoryBreakdown);

/**
 * @route GET /api/dashboard/recent-activity
 * @desc Get recent activity
 * @access Private
 */
router.get('/recent-activity', getRecentActivity);

/**
 * @route GET /api/dashboard/monthly-trends
 * @desc Get monthly trends
 * @access Private
 */
router.get('/monthly-trends', getMonthlyTrends);

export default router;
