"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/register
 * Public
 * Description: Register a new user
 */
router.post('/register', (req, res, next) => {
    (0, authController_1.registerUser)(req, res);
});
/**
 * POST /api/auth/login
 * Public
 * Description: Log in a user
 */
router.post('/login', (req, res, next) => {
    (0, authController_1.loginUser)(req, res);
});
/**
 * GET /api/auth/me
 * Protected
 * Description: Get authenticated user's details
 */
router.get('/me', (0, authMiddleware_1.authenticateToken)('access'), (req, res, next) => {
    (0, authController_1.getUserDetails)(req, res);
});
/**
 * PUT /api/auth/update
 * Protected
 * Description: Update the authenticated user's details
 */
router.put('/update', (0, authMiddleware_1.authenticateToken)('access'), (req, res, next) => {
    (0, authController_1.updateUser)(req, res);
});
/**
 * DELETE /api/auth/delete
 * Protected
 * Description: Delete the authenticated user's account
 */
router.delete('/delete', (0, authMiddleware_1.authenticateToken)('access'), (req, res, next) => {
    (0, authController_1.deleteUser)(req, res);
});
/**
 * DELETE /api/auth/logout
 *
 * Description: Logout the current authenticated user's account
 */
router.post('/logout', (req, res, next) => {
    (0, authController_1.logoutUser)(req, res);
});
exports.default = router;
