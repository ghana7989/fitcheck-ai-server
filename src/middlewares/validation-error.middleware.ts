import { Request, Response, NextFunction } from 'express';
import { ContainerTypes, ValidatedRequest } from 'express-joi-validation';
import { AppError } from './error.middleware';

// Extend AppError to include details property
declare module '../middlewares/error.middleware' {
  interface AppError {
    details?: Array<{ message: string; path: string[] }>;
  }
}

export const handleValidationError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err && err.error && err.error.isJoi) {
    // Extract error details
    const details = err.error.details.map((detail: any) => ({
      message: detail.message,
      path: detail.path
    }));

    // Create a standardized error
    const validationError = new AppError(`Validation Error: ${details[0].message}`, 400);
    
    // Add details for debugging
    validationError.details = details;
    
    // Pass to main error handler
    next(validationError);
  } else {
    // If not a validation error, pass to the next error handler
    next(err);
  }
}; 
