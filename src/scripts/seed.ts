/**
 * @fileoverview Database seeding script
 * @module scripts/seed
 * @author Adarsh Priyadarshi <adarshpriydarshi5646@gmail.com>
 */

import database from '../config/database';
import { User } from '../models/User.model';
import { FinancialRecord } from '../models/FinancialRecord.model';
import { UserRole, TransactionType } from '../types';
import { logger } from '../utils/logger';

/**
 * Seed database with sample data
 */
const seedDatabase = async (): Promise<void> => {
  try {
    /* Connect to database */
    await database.connect();

    /* Clear existing data */
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});

    logger.info('Cleared existing data');

    /* Create users */
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: UserRole.ADMIN,
    });

    const analyst = await User.create({
      email: 'analyst@example.com',
      password: 'password123',
      name: 'Analyst User',
      role: UserRole.ANALYST,
    });

    const viewer = await User.create({
      email: 'viewer@example.com',
      password: 'password123',
      name: 'Viewer User',
      role: UserRole.VIEWER,
    });

    logger.info('Created users:');
    logger.info(`  - ${admin.email} (${admin.role})`);
    logger.info(`  - ${analyst.email} (${analyst.role})`);
    logger.info(`  - ${viewer.email} (${viewer.role})`);

    /* Create financial records */
    const records = [
      {
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Salary',
        date: new Date('2026-04-01'),
        description: 'Monthly salary',
        userId: admin._id.toString(),
      },
      {
        amount: 1200,
        type: TransactionType.EXPENSE,
        category: 'Rent',
        date: new Date('2026-04-02'),
        description: 'Monthly rent payment',
        userId: admin._id.toString(),
      },
      {
        amount: 300,
        type: TransactionType.EXPENSE,
        category: 'Groceries',
        date: new Date('2026-04-03'),
        description: 'Weekly groceries',
        userId: admin._id.toString(),
      },
      {
        amount: 150,
        type: TransactionType.EXPENSE,
        category: 'Utilities',
        date: new Date('2026-04-03'),
        description: 'Electricity bill',
        userId: admin._id.toString(),
      },
      {
        amount: 500,
        type: TransactionType.INCOME,
        category: 'Freelance',
        date: new Date('2026-04-04'),
        description: 'Freelance project payment',
        userId: admin._id.toString(),
      },
      {
        amount: 80,
        type: TransactionType.EXPENSE,
        category: 'Transportation',
        date: new Date('2026-04-04'),
        description: 'Monthly bus pass',
        userId: admin._id.toString(),
      },
      {
        amount: 200,
        type: TransactionType.EXPENSE,
        category: 'Entertainment',
        date: new Date('2026-04-05'),
        description: 'Concert tickets',
        userId: admin._id.toString(),
      },
      {
        amount: 100,
        type: TransactionType.EXPENSE,
        category: 'Healthcare',
        date: new Date('2026-04-05'),
        description: 'Doctor visit',
        userId: admin._id.toString(),
      },
      {
        amount: 2000,
        type: TransactionType.INCOME,
        category: 'Investment',
        date: new Date('2026-03-15'),
        description: 'Stock dividends',
        userId: admin._id.toString(),
      },
      {
        amount: 450,
        type: TransactionType.EXPENSE,
        category: 'Shopping',
        date: new Date('2026-03-20'),
        description: 'Clothing',
        userId: admin._id.toString(),
      },
    ];

    await FinancialRecord.insertMany(records);

    logger.info(`Created ${records.length} financial records`);
    logger.info('\nDatabase seeded successfully!');
    logger.info('\nTest credentials:');
    logger.info('  Email: admin@example.com | Password: password123');
    logger.info('  Email: analyst@example.com | Password: password123');
    logger.info('  Email: viewer@example.com | Password: password123');

    await database.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
