import { Request, Response, NextFunction } from 'express'; 
import jwt from 'jsonwebtoken'; 
import { Token } from '../models/Token';
import dotenv from 'dotenv';


dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

/**
 * Middleware function to authenticate JSON Web Tokens (JWT)
 * This function checks if the incoming request has a valid JWT token.
 * If the token is valid, it attaches the decoded user information to the request object.
 * If the token is invalid or not present, it sends a corresponding error response.
 */
export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
  // Extract the token from the Authorization header; format is expected to be 'Bearer <token>'
  const token = req.headers['authorization']?.split(' ')[1];

  // Check if the token is provided; if not, return a 401 Unauthorized response
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return; // Ensure the function exits to prevent further processing
  }

  try {
    // Check if the token exists in the blacklist
    const blacklistedToken = await Token.findOne({ token });
    if (blacklistedToken) {
      res.status(403).json({ message: 'Token is revoked.' });
      return; // Exit after sending the response
    }

    // Verify the token using the secret key; this will decode the token payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user data to the request object for use in downstream middleware or routes
    req.user = decoded as any; 

    // Proceed to the next middleware function in the stack
    next();
  } catch (error) {
    // If token verification fails (due to being invalid or expired), send a 403 Forbidden response
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};