/**
 * @fileoverview Dashboard controller for handling analytics requests
 * @module controllers/dashboard
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { asyncHandler } from '../utils/asyncHandler';

const dashboardService = new DashboardService();

/**
 * Get dashboard summary
 * @route GET /api/dashboard/summary
 * @access Private
 */
export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await dashboardService.getSummary();

  res.status(200).json({
    success: true,
    data: summary,
  });
});

/**
 * Get category breakdown
 * @route GET /api/dashboard/category-breakdown
 * @access Private
 */
export const getCategoryBreakdown = asyncHandler(async (_req: Request, res: Response) => {
  const breakdown = await dashboardService.getCategoryBreakdown();

  res.status(200).json({
    success: true,
    data: breakdown,
  });
});

/**
 * Get recent activity
 * @route GET /api/dashboard/recent-activity
 * @access Private
 */
export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const activity = await dashboardService.getRecentActivity(limit);

  res.status(200).json({
    success: true,
    data: activity,
  });
});

/**
 * Get monthly trends
 * @route GET /api/dashboard/monthly-trends
 * @access Private
 */
export const getMonthlyTrends = asyncHandler(async (_req: Request, res: Response) => {
  const trends = await dashboardService.getMonthlyTrends();

  res.status(200).json({
    success: true,
    data: trends,
  });
});

/**
 * Get full dashboard
 * @route GET /api/dashboard
 * @access Private
 */
export const getFullDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const dashboard = await dashboardService.getFullDashboard();

  res.status(200).json({
    success: true,
    data: dashboard,
  });
});
