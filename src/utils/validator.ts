import { createValidator } from 'express-joi-validation';
import { Request } from 'express';

// Create a validator that will be used for all routes
export const validator = createValidator({
  passError: true, // Pass the error to the express error handler
  statusCode: 400, // Status code for validation errors
  joi: {
    abortEarly: false, // Return all errors, not just the first one
    allowUnknown: false, // Don't allow unknown properties in request objects
    stripUnknown: false // Don't remove unknown properties
  }
});

// Extend the Request interface to account for validated parameters
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
} 
