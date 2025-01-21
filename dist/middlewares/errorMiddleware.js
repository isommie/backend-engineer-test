"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
/**
 * Custom error handler middleware for catching and responding to internal server errors.
 * It logs the error details and provides a generic or detailed error response,
 * depending on the application environment.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error details;
    console.error(err.stack);
    // Provide a standard HTTP 500 Internal Server Error response
    res.status(500).json({
        message: 'Internal Server Error', // Generic error message
        error: process.env.NODE_ENV === 'production' ? undefined : err.message, // Include error details in non-production environments
    });
};
exports.errorHandler = errorHandler;
// 404 Not Found Middleware
const notFoundHandler = (req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
};
exports.notFoundHandler = notFoundHandler;
