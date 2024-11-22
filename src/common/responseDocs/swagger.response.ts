import { ApiResponseOptions } from '@nestjs/swagger';

export const SwaggerResponses = {
  created: (
    example: any,
    description = 'Request successful',
  ): ApiResponseOptions => ({
    status: 201,
    description,
    schema: {
      example,
    },
  }),
  OK: (
    example: any,
    description = 'Request successful',
  ): ApiResponseOptions => ({
    status: 200,
    description,
    schema: {
      example,
    },
  }),
  forbidden: (
    example: any,
    description = 'User is blocked',
  ): ApiResponseOptions => ({
    status: 403,
    description,
    schema: {
      example,
    },
  }),
  notFound: (
    example: any,
    description = 'User not found',
  ): ApiResponseOptions => ({
    status: 404,
    description,
    schema: {
      example,
    },
  }),
  unauthorized: (
    example: any,
    description = 'Unauthorized request',
  ): ApiResponseOptions => ({
    status: 401,
    description,
    schema: {
      example,
    },
  }),
  badRequest: (
    example: any,
    description = 'Bad request',
  ): ApiResponseOptions => ({
    status: 400,
    description,
    schema: {
      example,
    },
  }),
  conflict: (
    example: any,
    description = 'Conflict error',
  ): ApiResponseOptions => ({
    status: 409,
    description,
    schema: {
      example,
    },
  }),
  found: (
    example: any,
    description = 'Username found',
  ): ApiResponseOptions => ({
    status: 200,
    description,
    schema: {
      example,
    },
  }),
  internalServerError: (
    example: any,
    description = 'Internal server error',
  ): ApiResponseOptions => ({
    status: 500,
    description,
    schema: {
      example,
    },
  }),
};

// Examples for responses
export const ExampleResponses = {
  created: {
    message: 'String',
    success: true,
    data: { token: 'your-jwt-token' },
  },
  OK: {
    message: 'String',
    success: true,
    data: { token: 'your-jwt-token' },
  },
  forbidden: {
    message: 'String',
    success: false,
  },

  notFound: {
    message: 'String',
    success: false,
  },
  unauthorized: {
    message: 'String',
    success: false,
  },
  badRequest: {
    message: 'String',
    success: false,
    responseObject: {},
  },
  registerSuccess: {
    message: 'String',
    success: true,
    data: { token: 'your-jwt-token' },
  },
  conflict: {
    message: 'String',
    success: false,
  },
  found: {
    message: 'String',
    success: true,
    exist: true,
  },
  internalServerError: {
    message: 'String',
    success: false,
    error: {},
  },
};

// Example extension in swagger.responses.ts
