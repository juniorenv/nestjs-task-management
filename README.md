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

A robust task management REST API built with NestJS, TypeORM, and PostgreSQL. Features JWT authentication, comprehensive CRUD operations, interactive Swagger documentation, and Docker containerization.

## Features

- JWT-based authentication system
- User registration and login
- Complete task management (Create, Read, Update, Delete)
- Task filtering by title and status
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

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/srlightt/nestjs-task-management.git
cd nestjs-task-management
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Configure the following environment variables in `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION_TIME=3600

# Port Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=db
DB_USERNAME=postgres
DB_PASSWORD=your-db-password
```

### 3. Database Setup

#### Using Docker Compose (Recommended)

Start the entire application with database:

```bash
docker compose up -d
```

#### Manual PostgreSQL Setup

1. Install and start PostgreSQL
2. Create database: `db`
3. Run migrations:

```bash
npm run migration:run
```

### 4. Running the Application

#### Development Mode

```bash
npm run start:dev
```

#### Production Mode

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

**🚀 Interactive API documentation is available at `http://localhost:3000/docs`**

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

#### Get All Tasks

```http
GET /tasks
GET /tasks?title=example&status=TO_DO
```

**Query Parameters:**

- `title` (optional): Filter tasks by title (partial match)
- `status` (optional): Filter tasks by status

#### Get Single Task

```http
GET /tasks/{taskId}
```

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

#### Update Task (Partial Update)

```http
PATCH /tasks/{taskId}
Content-Type: application/json

{
  "status": "DONE"
}
```

#### Delete Task

```http
DELETE /tasks/{taskId}
```

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
- `status` (VARCHAR, Default: 'TO_DO')
- `created_at` (TIMESTAMPTZ)
- `expiration_date` (TIMESTAMPTZ)

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
│   ├── migrations/        # Database migrations
│   ├── database.module.ts
│   └── data-source.ts
├── common/                # Shared utilities
│   └── decorators/        # Custom decorators
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

- **400 Bad Request**: Invalid input data or malformed requests
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate username during registration
- **500 Internal Server Error**: Unexpected server errors

## Security Features

- Password hashing using bcrypt (salt rounds: 10)
- JWT token-based authentication with configurable expiration
- Request validation using class-validator
- Environment variable protection for sensitive data
- CORS protection (configurable)
- Input sanitization and validation

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
```
