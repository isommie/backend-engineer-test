"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Token_1 = require("../models/Token");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
/**
 * Middleware function to authenticate JSON Web Tokens (JWT)
 * This function checks if the incoming request has a valid JWT token.
 * If the token is valid, it attaches the decoded user information to the request object.
 * If the token is invalid or not present, it sends a corresponding error response.
 */
const authenticateToken = (tokenType) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Extract the token from the Authorization header; format is expected to be 'Bearer <token>'
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    // Check if the token is provided; if not, return a 401 Unauthorized response
    if (!token) {
        res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        return; // Ensure the function exits to prevent further processing
    }
    try {
        // Check if the token exists in the blacklist
        const blacklistedToken = yield Token_1.Token.findOne({ token });
        if (blacklistedToken) {
            res.status(403).json({ success: false, message: 'Token is revoked.' });
            return; // Exit after sending the response
        }
        // Verify the token using the secret key; this will decode the token payload
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach the decoded user data to the request object for use in downstream middleware or routes
        req.user = decoded;
        // Proceed to the next middleware function in the stack
        next();
    }
    catch (error) {
        // If token verification fails (due to being invalid or expired), send a 403 Forbidden response
        res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
});
exports.authenticateToken = authenticateToken;
