/**
 * @fileoverview Express application configuration
 * @module app
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config/env';
import { morganStream } from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';

/**
 * Create and configure Express application
 * @returns {Application} Configured Express app
 */
const createApp = (): Application => {
  const app = express();

  /* Security middleware */
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    })
  );

  /* Body parsing middleware */
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  /* Compression middleware */
  app.use(compression());

  /* Logging middleware */
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', { stream: morganStream }));
  }

  /* Rate limiting */
  app.use('/api', apiLimiter);

  /* Root endpoint */
  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Finance Data Processing and Access Control Backend API',
      version: '1.0.0',
      documentation: '/api/health',
    });
  });

  /* API routes */
  app.use('/api', routes);

  /* 404 handler */
  app.use(notFoundHandler);

  /* Error handler */
  app.use(errorHandler);

  return app;
};

export default createApp;
