import cors from 'cors';

// CORS middleware configuration
export const corsMiddleware = cors({
  origin: '*', // Allow requests from any origin; consider restricting this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify which headers can be used when making requests
});