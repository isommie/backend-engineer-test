"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
// Initialize environment variables
dotenv_1.default.config();
// Create an instance of Express
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // Parse incoming JSON requests
app.use((0, cors_1.default)()); // Enable Cross-Origin Resource Sharing
app.use((0, morgan_1.default)('dev')); // Log HTTP requests
// Database Connection
(0, database_1.default)();
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', (0, authMiddleware_1.authenticateToken)('access'), productRoutes_1.default); // Protected product routes
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});
// 404 Not Found Middleware
app.use(errorMiddleware_1.notFoundHandler);
// Global Error Handling Middleware
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
