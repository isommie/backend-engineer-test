"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.details.map((detail) => detail.message),
        });
    }
    next();
};
exports.validateRequest = validateRequest;
