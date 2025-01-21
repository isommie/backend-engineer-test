"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = void 0;
const formatResponse = (success, data = null, message = '') => {
    return {
        success,
        data,
        message,
    };
};
exports.formatResponse = formatResponse;
