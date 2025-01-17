import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  registerUser,
  loginUser,
  getUserDetails,
  updateUser,
  deleteUser,
  logoutUser,
} from '../controllers/authController';

const router: Router = Router();

/**
 * POST /api/auth/register
 * Public
 * Description: Register a new user
 */
router.post('/register', (req, res, next) => {
    registerUser(req, res);
});

/**
 * POST /api/auth/login
 * Public
 * Description: Log in a user
 */
router.post('/login', (req, res, next) => {
    loginUser(req, res);
});

/**
 * GET /api/auth/me
 * Protected
 * Description: Get authenticated user's details
 */
router.get('/me', authenticateToken, (req, res, next) => {
    getUserDetails(req, res);
});

/**
 * PUT /api/auth/update
 * Protected
 * Description: Update the authenticated user's details
 */
router.put('/update', authenticateToken, (req, res, next) => {
    updateUser(req, res);
});

/**
 * DELETE /api/auth/delete
 * Protected
 * Description: Delete the authenticated user's account
 */
router.delete('/delete', authenticateToken, (req, res, next) => {
    deleteUser(req, res);
});

/**
 * DELETE /api/auth/logout
 * 
 * Description: Logout the current authenticated user's account
 */
router.post('/logout', (req, res, next) => {
    logoutUser(req, res);
});

export default router;
