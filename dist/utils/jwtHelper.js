"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '1h';
/**
 * jwtHelper object that provides methods for creating and verifying JSON Web Tokens.
 */
exports.jwtHelper = {
    /**
     * Signs a payload to create a JWT.
     * @param payload - The data (typically user information) to include in the token.
     * @returns A signed JWT as a string.
     */
    signToken: (payload) => {
        // Sign the payload to create a token, using the secret and expiration
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    },
    /**
     * Verifies a JWT and decodes its payload.
     * @param token - The JWT to verify and decode.
     * @returns The decoded payload if the token is valid.
     * @throws Error if the token is invalid or expired.
     */
    verifyToken: (token) => {
        try {
            // Verify the token and return the decoded payload
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            throw new Error('Invalid or expired token'); // Inform the caller about the verification failure
        }
    },
};
