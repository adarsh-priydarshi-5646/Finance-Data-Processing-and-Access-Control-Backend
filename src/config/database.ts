/**
 * @fileoverview MongoDB database configuration and connection management
 * @module config/database
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Database connection class following Singleton pattern
 */
class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance of Database
   * @returns {Database} Database instance
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Connect to MongoDB database
   * @returns {Promise<void>}
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Using existing database connection');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance_db';

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });

      this.isConnected = true;
      logger.info('MongoDB connected successfully with connection pooling');

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB database
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns {boolean} Connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default Database.getInstance();
