import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import financialRecordRoutes from './financialRecord.routes';
import dashboardRoutes from './dashboard.routes';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

/**
 * API Version
 */
const API_VERSION = '/api/v1';

/**
 * Health check endpoint
 */
router.get('/health', healthCheck);
router.get(`${API_VERSION}/health`, healthCheck);

/**
 * Mount route modules
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/records', financialRecordRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
