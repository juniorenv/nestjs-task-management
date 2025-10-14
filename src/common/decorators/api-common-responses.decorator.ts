import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiInternalServerError() {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: 'Internal server error - database or system error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
        },
      },
    }),
  );
}

export function ApiUnauthorized() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description:
        'Authentication failed - Invalid, expired, or missing JWT token',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              statusCode: { type: 'number', example: 401 },
            },
          },
          examples: {
            missingToken: {
              summary: 'Missing Authorization Token',
              description: 'No token provided in the Authorization header',
              value: {
                message: 'Token not provided',
                error: 'Unauthorized',
                statusCode: 401,
              },
            },
            expiredToken: {
              summary: 'Expired Token',
              description:
                'The JWT token has expired and needs to be refreshed',
              value: {
                message: 'Token expired',
                error: 'Unauthorized',
                statusCode: 401,
              },
            },
            invalidToken: {
              summary: 'Invalid Token',
              description:
                'The JWT token is malformed or has an invalid signature',
              value: {
                message: 'Invalid token',
                error: 'Unauthorized',
                statusCode: 401,
              },
            },
            authenticationFailed: {
              summary: 'Authentication Failed',
              description: 'General authentication error',
              value: {
                message: 'Authentication failed',
                error: 'Unauthorized',
                statusCode: 401,
              },
            },
          },
        },
      },
    }),
  );
}

export function ApiLoginUnauthorized() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Authentication failed - Invalid credentials provided',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Authentication failed' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
        },
      },
    }),
  );
}

export function ApiNotFound() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'Task not found - no task exists with the provided ID',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example:
              'Task with ID 123e4567-e89b-12d3-a456-426614174000 not found',
          },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
        },
      },
    }),
  );
}

export function ApiBadRequest() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Invalid task ID format - not a valid UUID',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Invalid task ID format: invalid-id',
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
  );
}
