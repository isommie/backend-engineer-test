"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware for validating incoming requests using express-validator.
 * It checks for validation errors and sends a 400 response if any are found,
 * along with details about the errors.
 */
const validate = (req, res, next) => {
    // Extract validation errors from the request
    const errors = (0, express_validator_1.validationResult)(req);
    // Check if there are any validation errors
    if (!errors.isEmpty()) {
        // Send a 400 Bad Request response with the validation errors
        return res.status(400).json({ errors: errors.array() });
    }
    // Proceed to the next middleware/controller if validation passes
    next();
};
exports.validate = validate;
