import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return; // Ensure the function exits
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as any; // Explicitly cast if necessary
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
