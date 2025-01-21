import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database';
import { authenticateToken } from './middlewares/authMiddleware';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

// Initialize environment variables
dotenv.config();

// Create an instance of Express
const app: Application = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log HTTP requests

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', authenticateToken('access'), productRoutes); // Protected product routes

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 Not Found Middleware
app.use(notFoundHandler);

// Global Error Handling Middleware
app.use(errorHandler);

export default app;
