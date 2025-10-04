[TYPESCRIPT__BADGE]: https://img.shields.io/badge/typescript-D4FAFF?style=for-the-badge&logo=typescript
[NESTJS__BADGE]: https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs
[TYPEORM__BADGE]: https://img.shields.io/badge/typeorm-FE0803?style=for-the-badge&logo=typeorm
[JWT__BADGE]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[POSTGRES__BADGE]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[DOCKER__BADGE]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[BCRYPT__BADGE]: https://img.shields.io/badge/bcrypt-4A4A55?style=for-the-badge&logo=npm
[SWAGGER__BADGE]: https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black

# NestJS Task Management API

![TypeScript][TYPESCRIPT__BADGE]
![NestJS][NESTJS__BADGE]
![TypeORM][TYPEORM__BADGE]
![JWT][JWT__BADGE]
![PostgreSQL][POSTGRES__BADGE]
![Docker][DOCKER__BADGE]
![Bcrypt][BCRYPT__BADGE]
![Swagger][SWAGGER__BADGE]

A robust task management REST API built with NestJS, TypeORM, and PostgreSQL. Features JWT authentication, user-specific task isolation, comprehensive CRUD operations, interactive Swagger documentation, and Docker containerization.

## Features

- JWT-based authentication system
- User registration and login
- **User-specific task management** - Each user can only access and manage their own tasks
- Complete task management (Create, Read, Update, Delete)
- Task filtering by title and status
- **Database relationship management** - Foreign key constraints and cascading deletes
- **Performance optimization** - Indexed queries for faster searches
- **Interactive Swagger API documentation at `/docs`**
- PostgreSQL database with migrations
- Docker support with multi-stage builds
- Input validation and error handling
- RESTful API design
- Comprehensive API testing interface

## Technology Stack

- **Framework**: NestJS (v11.x)
- **Database**: PostgreSQL 17
- **ORM**: TypeORM (v0.3.26)
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI 3.0
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- PostgreSQL (if running locally)
- Docker & Docker Compose (for containerized setup)

## Installation & Setup

Choose your preferred setup method:

### Option A: Docker Setup (Recommended for Quick Start)

Perfect for trying out the API quickly or if you don't want to install PostgreSQL locally.

#### 1. Clone and Setup

```bash
git clone https://github.com/juniorenv/nestjs-task-management.git
cd nestjs-task-management
```

#### 2. Custom Configuration

If you want to customize settings:

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your preferred settings
vim .env  # or use your preferred editor
```

Example `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION_TIME=3600

# Port Configuration
PORT=3000

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=taskmanagement
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
```

#### 3. Start with Custom Config

```bash
docker compose up -d

# The API will be available at http://localhost:3000
# Swagger documentation at http://localhost:3000/docs
```

#### 4. Verify Installation

```bash
# Check if services are running
docker compose ps

# View logs
docker compose logs -f app

# Stop services
docker compose down
```

### Option B: Local Development Setup

Best for active development, debugging, and when you want full control over the environment.

#### 1. Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- PostgreSQL (v17 or higher)

#### 2. Clone and Install

```bash
git clone https://github.com/juniorenv/nestjs-task-management.git
cd nestjs-task-management
npm install
```

#### 3. Database Setup

**Prerequisites:**

- Install PostgreSQL (v17 or higher) on your system
- Ensure PostgreSQL service is running
- Create a database named `taskmanagement`

#### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env
```

Configure `.env` for local development:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION_TIME=3600

# Port Configuration
PORT=3000

# Database Configuration (Local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanagement
DB_USERNAME=postgres
DB_PASSWORD=your-database-password
```

#### 5. Run Database Migrations

```bash
# Build the application first
npm run build

# Run migrations
npm run migration:run
```

#### 6. Start the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Debug mode
npm run start:debug

# Production mode
npm run build
npm run start:prod
```

#### 7. Verify Installation

The API will be available at:

- **Main API**: `http://localhost:3000`
- **Interactive API documentation is available at `http://localhost:3000/docs`**

## Interactive API Documentation (Swagger)

This API includes comprehensive interactive Swagger documentation that allows you to:

- **Explore all available endpoints** with detailed descriptions
- **Test API calls directly** from the browser interface
- **View complete request/response schemas** with examples
- **Authenticate with JWT tokens** for protected endpoints
- **See validation rules** and error responses
- **Export API specification** in OpenAPI format

### Accessing Swagger UI

Once the application is running, visit:

```
http://localhost:3000/docs
```

### Using Swagger with Authentication

1. **Create Account**: Use the `POST /users` endpoint to register
2. **Login**: Use the `POST /auth/login` endpoint to get your JWT token
3. **Authorize**: Click the "🔒 Authorize" button in Swagger UI
4. **Enter Token**: Input your token
5. **Test Endpoints**: Now you can test all protected endpoints seamlessly

### Swagger Features Available

- **Persistent Authorization**: Your JWT token persists across browser sessions
- **Request Duration Display**: See how long each API call takes
- **Interactive Forms**: Easy-to-use forms for testing endpoints
- **Response Examples**: See actual API responses with proper formatting
- **Error Documentation**: Comprehensive error response examples
- **Schema Validation**: Real-time validation of request payloads

## API Documentation

### Authentication Endpoints

#### Register User

```http
POST /users
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "id": "uuid",
  "username": "johndoe"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### Task Management Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Important**: Each user can only access and manage their own tasks. The API automatically filters tasks based on the authenticated user.

#### Get All Tasks

```http
GET /tasks
GET /tasks?title=example&status=TO_DO
```

**Query Parameters:**

- `title` (optional): Filter tasks by title (partial match)
- `status` (optional): Filter tasks by exact status match

**Note**: Only returns tasks belonging to the authenticated user.

#### Get Single Task

```http
GET /tasks/{taskId}
```

**Note**: Returns 404 if the task doesn't exist or belongs to another user.

#### Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API documentation",
  "status": "TO_DO",
  "expirationDate": "2024-12-31T23:59:59.000Z"
}
```

**Response:**

```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API documentation",
  "status": "TO_DO",
  "expirationDate": "2024-12-31T23:59:59.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Note**: The `userId` field is automatically populated from the JWT token and cannot be specified by the client.

#### Update Task (Full Update)

```http
PUT /tasks/{taskId}
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "expirationDate": "2024-12-31T23:59:59.000Z"
}
```

**Note**: Only updates tasks owned by the authenticated user.

#### Update Task (Partial Update)

```http
PATCH /tasks/{taskId}
Content-Type: application/json

{
  "status": "DONE"
}
```

**Note**: Only updates tasks owned by the authenticated user.

#### Delete Task

```http
DELETE /tasks/{taskId}
```

**Note**: Only deletes tasks owned by the authenticated user.

### Task Status Values

- `TO_DO` - Task is pending
- `IN_PROGRESS` - Task is being worked on
- `DONE` - Task is completed

### Response Format

All successful responses return JSON with the requested data. Error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `username` (VARCHAR, Unique)
- `password_hash` (VARCHAR)

### Tasks Table

- `id` (UUID, Primary Key)
- `title` (VARCHAR, 1-256 chars)
- `description` (VARCHAR, 1-512 chars)
- `status` (VARCHAR, Default: 'TO_DO', CHECK constraint)
- `created_at` (TIMESTAMPTZ)
- `expiration_date` (TIMESTAMPTZ)
- `user_id` (UUID, Foreign Key → users.id, ON DELETE CASCADE)

### Database Relationships

- **One-to-Many**: User → Tasks (one user can have many tasks)
- **Cascade Delete**: When a user is deleted, all their tasks are automatically deleted
- **Foreign Key Constraint**: Ensures referential integrity between tasks and users

### Database Indexes

For optimal query performance:

- **idx_tasks_user_status**: Composite index on `(user_id, status)` for filtered task queries
- **idx_tasks_user_id_title_trgm**: GIN index on `(user_id, title)` for fast title searches using trigram matching

### PostgreSQL Extensions

- **uuid-ossp**: For UUID generation
- **pg_trgm**: For trigram-based text similarity searches
- **btree_gin**: For efficient composite GIN indexes

## Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npm run migration:create   # Create new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Code Quality
npm run lint               # Lint and fix code
npm run format             # Format code with Prettier
```

### Creating Database Migrations

```bash
npm run migration:create --name=your-migration-name
```

### Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   ├── auth.module.ts
│   └── auth.dto.ts
├── user/                  # User management module
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.module.ts
│   └── user.dto.ts
├── task/                  # Task management module
│   ├── task.controller.ts
│   ├── task.service.ts
│   ├── task.module.ts
│   └── task.dto.ts
├── database/              # Database configuration
│   ├── entities/          # TypeORM entities
│   │   ├── user.entity.ts # User entity with tasks relation
│   │   └── task.entity.ts # Task entity with user relation
│   ├── migrations/        # Database migrations
│   │   ├── 1756494841652-user-table.ts
│   │   ├── 1756494848553-task-table.ts
│   │   └── 1759154081649-add-task-indexes.ts
│   ├── database.module.ts
│   └── data-source.ts
├── common/                # Shared utilities
│   ├── decorators/        # Custom decorators
│       └── api-common-responses.decorator.ts
│   └── interfaces/        # TypeScript interfaces
│       └── authenticated-request.interface.ts
├── app.module.ts          # Root application module
└── main.ts               # Application entry point
```

## Docker Deployment

The application includes a multi-stage Dockerfile for optimized production builds:

1. **Base stage**: Installs dependencies
2. **Builder stage**: Compiles TypeScript
3. **Production stage**: Creates minimal runtime image

### Docker Commands

```bash
# Build image
docker build -t nestjs-task-management .

# Run with Docker Compose
docker compose up -d

# View logs
docker compose logs -f task-management

# Stop services
docker compose down
```

## Error Handling

The API implements comprehensive error handling:

- **400 Bad Request**: Invalid input data, malformed requests, or invalid user ID
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Resource not found or user doesn't have access
- **409 Conflict**: Duplicate username during registration
- **500 Internal Server Error**: Unexpected server errors

## Security Features

- Password hashing using bcrypt (salt rounds: 10)
- JWT token-based authentication with configurable expiration
- **User isolation** - Users can only access their own tasks
- **Database-level security** - Foreign key constraints prevent orphaned records
- Request validation using class-validator
- Environment variable protection for sensitive data
- CORS protection (configurable)
- Input sanitization and validation

## Data Isolation & Privacy

This API implements strict data isolation:

- **Task Ownership**: Every task is associated with a specific user via `user_id`
- **Automatic Filtering**: All task queries are automatically filtered by the authenticated user's ID
- **Access Control**: Users cannot view, modify, or delete tasks belonging to other users
- **Cascade Protection**: When a user account is deleted, all their tasks are automatically removed

## Performance Optimizations

The API includes several performance enhancements:

- **Indexed Queries**: Composite indexes on frequently queried columns
- **Trigram Matching**: Fast full-text search on task titles using PostgreSQL's pg_trgm extension
- **Efficient Joins**: Optimized database relationships with proper foreign key indexes
- **Query Optimization**: Status filters use exact matching instead of pattern matching

## API Testing

### Using Swagger UI (Recommended)

1. Navigate to `http://localhost:3000/docs`
2. Use the interactive interface to test all endpoints
3. Authenticate once and test multiple endpoints seamlessly

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Login and get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Use token for authenticated requests
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer <your-jwt-token>"

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing task creation",
    "status": "TO_DO",
    "expirationDate": "2025-12-31T23:59:59.000Z"
  }'
```
