import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with the appropriate type for `user`, if available.
    }
  }
}
