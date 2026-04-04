/**
 * @fileoverview Environment configuration and validation
 * @module config/env
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

/**
 * Environment configuration interface
 */
interface IEnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
}

/**
 * Validate and return environment configuration
 * @returns {IEnvConfig} Validated environment configuration
 */
const getEnvConfig = (): IEnvConfig => {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      logger.error(`Missing required environment variable: ${envVar}`);
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  };
};

export const config = getEnvConfig();
