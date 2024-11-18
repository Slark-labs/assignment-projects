import { ApiResponseOptions } from '@nestjs/swagger';

export const SwaggerResponses = {
  success: (example: any): ApiResponseOptions => ({
    status: 200,
    description: 'Request successful',
    schema: { example },
  }),
  notFound: (example: any): ApiResponseOptions => ({
    status: 404,
    description: 'Resource not found',
    schema: { example },
  }),
  unauthorized: (example: any): ApiResponseOptions => ({
    status: 401,
    description: 'Unauthorized request',
    schema: { example },
  }),
  badRequest: (example: any): ApiResponseOptions => ({
    status: 400,
    description: 'Validation error',
    schema: { example },
  }),
  conflict: (example: any): ApiResponseOptions => ({
    status: 409,
    description: 'Conflict error',
    schema: { example },
  }),
};

// Examples for responses
export const ExampleResponses = {
  success: {
    message: 'Login successful',
    success: true,
    data: { token: 'your-jwt-token' },
  },
  notFound: {
    message: 'User not found',
    success: false,
  },
  unauthorized: {
    message: 'Invalid credentials',
    success: false,
  },
  badRequest: {
    message: 'Validation failed.',
    success: false,
    errors: [{ field: 'general', error: 'Some error message' }],
  },
  registerSuccess: {
    message: 'User created successfully',
    success: true,
    data: { token: 'your-jwt-token' },
  },
  conflict: {
    message: 'User already exists',
    success: false,
  },
};
// Example extension in swagger.responses.ts
