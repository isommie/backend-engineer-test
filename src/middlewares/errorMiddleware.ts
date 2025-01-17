import { Request, Response, NextFunction } from 'express'; 

/**
 * Custom error handler middleware for catching and responding to internal server errors.
 * It logs the error details and provides a generic or detailed error response,
 * depending on the application environment.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error details;
  console.error(err.stack);

  // Provide a standard HTTP 500 Internal Server Error response
  res.status(500).json({
    message: 'Internal Server Error', // Generic error message
    error: process.env.NODE_ENV === 'production' ? undefined : err.message, // Include error details in non-production environments
  });
};

// 404 Not Found Middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  };