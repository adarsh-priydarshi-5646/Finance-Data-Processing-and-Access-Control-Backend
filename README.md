# Finance Data Processing and Access Control Backend

A production-ready backend system for managing financial records with role-based access control, built with Node.js, Express, TypeScript, and MongoDB.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Access Control](#access-control)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Author](#author)

## Features

- User management with role-based access control
- Financial records CRUD operations with filtering
- Dashboard analytics with real-time calculations
- JWT-based authentication and authorization
- Comprehensive input validation
- Centralized error handling
- Request logging with Winston and Morgan
- Rate limiting for API protection
- MongoDB database with Mongoose ODM
- TypeScript for type safety
- Clean architecture with separation of concerns

## Technology Stack

- **Runtime**: Node.js (v16+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS, express-rate-limit
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/adarsh-priydarshi-5646/Finance-Data-Processing-and-Access-Control-Backend.git
cd Finance-Data-Processing-and-Access-Control-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env` file (see Configuration section)

5. Build the project:
```bash
npm run build
```

6. Seed the database with sample data (optional):
```bash
npm run seed
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/finance_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Other Commands
```bash
npm run build        # Build TypeScript to JavaScript
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run seed         # Seed database with sample data
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
Creates a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "viewer"
}
```

**Request Fields**:
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 6 characters
- `name` (string, required): User's full name (2-50 characters)
- `role` (string, optional): User role - `viewer`, `analyst`, or `admin` (default: `viewer`)

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "viewer",
      "status": "active",
      "createdAt": "2026-04-05T10:30:00.000Z",
      "updatedAt": "2026-04-05T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
Authenticates a user and returns a JWT token.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Request Fields**:
- `email` (string, required): User's email address
- `password` (string, required): User's password

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin",
      "status": "active",
      "createdAt": "2026-04-05T10:30:00.000Z",
      "updatedAt": "2026-04-05T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Authentication Header**:
For all protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Dashboard Endpoints

All dashboard endpoints require authentication.

#### Get Full Dashboard
Returns complete dashboard data including summary, category breakdown, recent activity, and monthly trends.

**Endpoint**: `GET /api/dashboard`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 7500,
      "totalExpense": 2480,
      "netBalance": 5020,
      "totalRecords": 10
    },
    "categoryBreakdown": {
      "income": {
        "Salary": { "total": 5000, "count": 1 },
        "Freelance": { "total": 500, "count": 1 },
        "Investment": { "total": 2000, "count": 1 }
      },
      "expense": {
        "Rent": { "total": 1200, "count": 1 },
        "Groceries": { "total": 300, "count": 1 },
        "Utilities": { "total": 150, "count": 1 }
      }
    },
    "recentActivity": [
      {
        "id": "507f1f77bcf86cd799439011",
        "amount": 200,
        "type": "expense",
        "category": "Entertainment",
        "date": "2026-04-05T00:00:00.000Z",
        "description": "Concert tickets",
        "userId": "507f1f77bcf86cd799439012",
        "createdAt": "2026-04-05T10:30:00.000Z",
        "updatedAt": "2026-04-05T10:30:00.000Z"
      }
    ],
    "monthlyTrends": [
      {
        "month": "2026-04",
        "income": 5500,
        "expense": 2030,
        "net": 3470
      },
      {
        "month": "2026-03",
        "income": 2000,
        "expense": 450,
        "net": 1550
      }
    ]
  }
}
```

#### Get Summary
Returns financial summary statistics.

**Endpoint**: `GET /api/dashboard/summary`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalIncome": 7500,
    "totalExpense": 2480,
    "netBalance": 5020,
    "totalRecords": 10
  }
}
```

#### Get Category Breakdown
Returns income and expense breakdown by category.

**Endpoint**: `GET /api/dashboard/category-breakdown`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "income": {
      "Salary": { "total": 5000, "count": 1 },
      "Freelance": { "total": 500, "count": 1 }
    },
    "expense": {
      "Rent": { "total": 1200, "count": 1 },
      "Groceries": { "total": 300, "count": 1 }
    }
  }
}
```

#### Get Recent Activity
Returns recent financial transactions.

**Endpoint**: `GET /api/dashboard/recent-activity`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `limit` (number, optional): Number of records to return (default: 10)

**Example**: `GET /api/dashboard/recent-activity?limit=5`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "amount": 200,
      "type": "expense",
      "category": "Entertainment",
      "date": "2026-04-05T00:00:00.000Z",
      "description": "Concert tickets",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2026-04-05T10:30:00.000Z",
      "updatedAt": "2026-04-05T10:30:00.000Z"
    }
  ]
}
```

#### Get Monthly Trends
Returns monthly income and expense trends for the last 12 months.

**Endpoint**: `GET /api/dashboard/monthly-trends`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "month": "2026-04",
      "income": 5500,
      "expense": 2030,
      "net": 3470
    },
    {
      "month": "2026-03",
      "income": 2000,
      "expense": 450,
      "net": 1550
    }
  ]
}
```

### Financial Records Endpoints

#### Get All Records
Returns a list of financial records with optional filtering.

**Endpoint**: `GET /api/records`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `type` (string, optional): Filter by transaction type - `income` or `expense`
- `category` (string, optional): Filter by category name
- `startDate` (string, optional): Filter records from this date (ISO 8601 format)
- `endDate` (string, optional): Filter records until this date (ISO 8601 format)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Records per page (default: 50, max: 100)

**Example**: `GET /api/records?type=income&startDate=2026-01-01&endDate=2026-12-31&page=1&limit=20`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "amount": 5000,
      "type": "income",
      "category": "Salary",
      "date": "2026-04-01T00:00:00.000Z",
      "description": "Monthly salary",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2026-04-01T10:30:00.000Z",
      "updatedAt": "2026-04-01T10:30:00.000Z"
    }
  ]
}
```

#### Get Record by ID
Returns a specific financial record.

**Endpoint**: `GET /api/records/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the record

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2026-04-01T00:00:00.000Z",
    "description": "Monthly salary",
    "userId": "507f1f77bcf86cd799439012",
    "createdAt": "2026-04-01T10:30:00.000Z",
    "updatedAt": "2026-04-01T10:30:00.000Z"
  }
}
```

#### Create Record
Creates a new financial record. Requires Analyst or Admin role.

**Endpoint**: `POST /api/records`

**Headers**:
```
Authorization: Bearer <token>
```

**Access**: Analyst, Admin

**Request Body**:
```json
{
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-05",
  "description": "Monthly salary"
}
```

**Request Fields**:
- `amount` (number, required): Transaction amount (must be greater than 0)
- `type` (string, required): Transaction type - `income` or `expense`
- `category` (string, required): Category name (2-50 characters)
- `date` (string, required): Transaction date (ISO 8601 format)
- `description` (string, optional): Transaction description (max 500 characters)

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "amount": 1500,
    "type": "income",
    "category": "Salary",
    "date": "2026-04-05T00:00:00.000Z",
    "description": "Monthly salary",
    "userId": "507f1f77bcf86cd799439012",
    "createdAt": "2026-04-05T10:30:00.000Z",
    "updatedAt": "2026-04-05T10:30:00.000Z"
  }
}
```

#### Update Record
Updates an existing financial record. Requires Admin role.

**Endpoint**: `PUT /api/records/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Access**: Admin only

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the record

**Request Body**:
```json
{
  "amount": 1600,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-05",
  "description": "Updated monthly salary"
}
```

**Request Fields**: Same as Create Record

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Record updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "amount": 1600,
    "type": "income",
    "category": "Salary",
    "date": "2026-04-05T00:00:00.000Z",
    "description": "Updated monthly salary",
    "userId": "507f1f77bcf86cd799439012",
    "createdAt": "2026-04-05T10:30:00.000Z",
    "updatedAt": "2026-04-05T11:00:00.000Z"
  }
}
```

#### Delete Record
Deletes a financial record. Requires Admin role.

**Endpoint**: `DELETE /api/records/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Access**: Admin only

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the record

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

### User Management Endpoints

All user management endpoints require Admin role.

#### Get All Users
Returns a list of all users.

**Endpoint**: `GET /api/users`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Access**: Admin only

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin",
      "status": "active",
      "createdAt": "2026-04-01T10:30:00.000Z",
      "updatedAt": "2026-04-01T10:30:00.000Z"
    }
  ]
}
```

#### Get User by ID
Returns a specific user.

**Endpoint**: `GET /api/users/:id`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Access**: Admin only

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "status": "active",
    "createdAt": "2026-04-01T10:30:00.000Z",
    "updatedAt": "2026-04-01T10:30:00.000Z"
  }
}
```

#### Update User Status
Updates a user's status (active/inactive).

**Endpoint**: `PATCH /api/users/:id/status`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Access**: Admin only

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Request Body**:
```json
{
  "status": "inactive"
}
```

**Request Fields**:
- `status` (string, required): User status - `active` or `inactive`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "User Name",
    "role": "viewer",
    "status": "inactive",
    "createdAt": "2026-04-01T10:30:00.000Z",
    "updatedAt": "2026-04-05T11:00:00.000Z"
  }
}
```

#### Update User Role
Updates a user's role.

**Endpoint**: `PATCH /api/users/:id/role`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Access**: Admin only

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Request Body**:
```json
{
  "role": "analyst"
}
```

**Request Fields**:
- `role` (string, required): User role - `viewer`, `analyst`, or `admin`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "User Name",
    "role": "analyst",
    "status": "active",
    "createdAt": "2026-04-01T10:30:00.000Z",
    "updatedAt": "2026-04-05T11:00:00.000Z"
  }
}
```

#### Delete User
Deletes a user account.

**Endpoint**: `DELETE /api/users/:id`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Access**: Admin only

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Health Check Endpoint

#### Health Check
Returns server health status.

**Endpoint**: `GET /api/health`

**Access**: Public

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-05T10:30:00.000Z"
}
```

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  name: String,
  role: String (enum: ['viewer', 'analyst', 'admin']),
  status: String (enum: ['active', 'inactive']),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `email`: Unique index for fast lookups

### Financial Records Collection

```javascript
{
  _id: ObjectId,
  amount: Number (min: 0.01),
  type: String (enum: ['income', 'expense']),
  category: String,
  date: Date,
  description: String,
  userId: ObjectId (ref: 'User', indexed),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId`: Index for user-specific queries
- `userId, date`: Compound index for filtered queries
- `type, category`: Compound index for category breakdown
- `date`: Index for date-based filtering

## Access Control

### Role Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View Dashboard | Yes | Yes | Yes |
| View Records | Yes | Yes | Yes |
| Create Records | No | Yes | Yes |
| Update Records | No | No | Yes |
| Delete Records | No | No | Yes |
| View Users | No | No | Yes |
| Manage Users | No | No | Yes |

### Role Descriptions

**Viewer**:
- Read-only access to dashboard and financial records
- Cannot create, update, or delete any data
- Cannot access user management

**Analyst**:
- All Viewer permissions
- Can create new financial records
- Cannot update or delete existing records
- Cannot access user management

**Admin**:
- Full access to all features
- Can perform all CRUD operations on financial records
- Can manage users (create, update, delete, change roles)
- Can view all system data

## Project Structure

```
src/
├── config/
│   ├── database.ts          # MongoDB connection management
│   └── env.ts               # Environment configuration
├── controllers/
│   ├── auth.controller.ts   # Authentication handlers
│   ├── dashboard.controller.ts
│   ├── financialRecord.controller.ts
│   ├── health.controller.ts
│   └── user.controller.ts
├── middleware/
│   ├── auth.middleware.ts   # JWT authentication & authorization
│   ├── errorHandler.ts      # Centralized error handling
│   ├── rateLimiter.middleware.ts
│   └── validation.middleware.ts
├── models/
│   ├── FinancialRecord.model.ts
│   └── User.model.ts
├── repositories/
│   ├── financialRecord.repository.ts
│   └── user.repository.ts
├── routes/
│   ├── auth.routes.ts
│   ├── dashboard.routes.ts
│   ├── financialRecord.routes.ts
│   ├── index.ts
│   └── user.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   ├── financialRecord.service.ts
│   └── user.service.ts
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   ├── asyncHandler.ts      # Async error wrapper
│   ├── errors.ts            # Custom error classes
│   ├── jwt.ts               # JWT utilities
│   └── logger.ts            # Winston logger configuration
├── validators/
│   ├── auth.validator.ts
│   ├── financialRecord.validator.ts
│   └── user.validator.ts
├── scripts/
│   └── seed.ts              # Database seeding script
├── app.ts                   # Express app configuration
└── server.ts                # Server entry point
```

## Security Features

### Authentication
- JWT token-based authentication
- Token expiration: 24 hours (configurable)
- Secure password hashing using bcrypt (10 salt rounds)

### Authorization
- Role-based access control (RBAC)
- Middleware-based permission checking
- Route-level protection

### Input Validation
- express-validator for request validation
- Type checking with TypeScript
- Sanitization of user inputs

### Security Headers
- Helmet middleware for security headers
- CORS configuration
- Content Security Policy

### Rate Limiting
- 100 requests per 15 minutes (general API)
- 5 requests per 15 minutes (authentication endpoints)
- IP-based rate limiting

### Data Protection
- Password hashing with bcrypt
- No sensitive data in error responses
- MongoDB injection protection through Mongoose

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PUT, PATCH, DELETE requests
- `201 Created`: Successful POST requests
- `400 Bad Request`: Invalid input or validation errors
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (e.g., email already exists)
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side errors

### Validation Errors

Validation errors return an array of field-specific errors:

```json
{
  "success": false,
  "error": "[{\"field\":\"email\",\"message\":\"Valid email is required\"}]"
}
```

## Testing

### Default Test Accounts

After running `npm run seed`, the following accounts are available:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | admin |
| analyst@example.com | password123 | analyst |
| viewer@example.com | password123 | viewer |

### Manual Testing

1. Start the server:
```bash
npm run dev
```

2. Login to get a token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

3. Use the token in subsequent requests:
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Deployment

### Environment Variables for Production

Ensure the following environment variables are set:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-strong-random-secret-key
JWT_EXPIRE=24h
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=error
```

### Using PM2

```bash
npm run build
pm2 start dist/server.js --name finance-backend
pm2 save
pm2 startup
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t finance-backend .
docker run -p 3000:3000 --env-file .env finance-backend
```

## Author

**Adarsh Priyadarshi**

- Email: adarshpriydarshi5646@gmail.com
- GitHub: [@adarsh-priydarshi-5646](https://github.com/adarsh-priydarshi-5646)

## License

This project is licensed under the MIT License.
