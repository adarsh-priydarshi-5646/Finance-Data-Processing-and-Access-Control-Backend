/**
 * @fileoverview Server entry point
 * @module server
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import { config } from './config/env';
import database from './config/database';
import { logger } from './utils/logger';
import createApp from './app';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    /* Connect to database */
    await database.connect();

    /* Create Express app */
    const app = createApp();

    /* Start server */
    const server = app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
      logger.info(`API available at http://localhost:${config.PORT}/api`);
    });

    /* Graceful shutdown */
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await database.disconnect();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      /* Force shutdown after 10 seconds */
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    /* Handle shutdown signals */
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    /* Handle uncaught exceptions */
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    /* Handle unhandled promise rejections */
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/* Start the server */
startServer();
