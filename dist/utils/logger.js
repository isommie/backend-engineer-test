"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    log: (message) => {
        console.log(`[LOG]: ${message}`);
    },
    error: (message) => {
        console.error(`[ERROR]: ${message}`);
    },
    warn: (message) => {
        console.warn(`[WARN]: ${message}`);
    },
};
