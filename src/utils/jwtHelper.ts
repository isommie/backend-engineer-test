import jwt from 'jsonwebtoken'; 


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const JWT_EXPIRATION = '1h'; 

/**
 * jwtHelper object that provides methods for creating and verifying JSON Web Tokens.
 */
export const jwtHelper = {
  /**
   * Signs a payload to create a JWT.
   * @param payload - The data (typically user information) to include in the token.
   * @returns A signed JWT as a string.
   */
  signToken: (payload: object): string => {
    // Sign the payload to create a token, using the secret and expiration
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  },

  /**
   * Verifies a JWT and decodes its payload.
   * @param token - The JWT to verify and decode.
   * @returns The decoded payload if the token is valid.
   * @throws Error if the token is invalid or expired.
   */
  verifyToken: (token: string): any => {
    try {
      // Verify the token and return the decoded payload
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token'); // Inform the caller about the verification failure
    }
  },
};