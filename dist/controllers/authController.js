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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.deleteUser = exports.updateUser = exports.getUserDetails = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const hashHelper_1 = require("../utils/hashHelper");
const jwtHelper_1 = require("../utils/jwtHelper");
const Token_1 = require("../models/Token");
/**
 * Handle user registration
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract email, password, and username from the request body
        const { email, password, username } = req.body;
        // Check if the email already exists in the database
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            // Return an error if the email is already registered
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }
        // Hash the user's password using hashHelper
        const hashedPassword = yield hashHelper_1.hashHelper.hashPassword(password);
        const user = new User_1.User({ email, password: hashedPassword, username });
        // Save the new user to the database
        yield user.save();
        // Return a success response with the new user's data
        return res.status(201).json({
            success: true,
            data: {
                email: user.email,
                username: user.username
            }
        });
    }
    catch (error) {
        // Log the error for debugging
        console.error(error);
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to register user' });
    }
});
exports.registerUser = registerUser;
/**
 * Handle user login
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;
        // Find the user with the provided email
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            // Return an error if the user does not exist
            return res.status(404).json({ success: false, message: 'Invalid credentials' });
        }
        // Compare the provided password with the stored hashed password using hashHelper
        const isMatch = yield hashHelper_1.hashHelper.comparePassword(password, user.password);
        if (!isMatch) {
            // Return an error if the passwords do not match
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        // Generate a JSON Web Token (JWT) with the user's ID
        const token = jwtHelper_1.jwtHelper.signToken({ id: user._id });
        // Return a success response with the JWT
        return res.status(200).json({ success: true, token });
    }
    catch (error) {
        // Log the error for debugging
        console.error(error);
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to login' });
    }
});
exports.loginUser = loginUser;
/**
 * Get user details (protected route, requires valid JWT)
 */
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if req.user is populated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // Find the user with the ID from the JWT
        const user = yield User_1.User.findById(req.user.id).select('-password');
        if (!user) {
            // Return an error if the user does not exist
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Return the user's details with the password omitted
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        // Log the error for debugging
        console.error('Error fetching user details:', error);
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to get user details' });
    }
});
exports.getUserDetails = getUserDetails;
/**
 * Update user details (protected route, requires valid JWT)
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract username and email from the request body
        const { username, email } = req.body;
        // Update the user's details with the provided data
        const user = yield User_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, { username, email }, { new: true, runValidators: true } // Run validation on the updated data
        );
        if (!user) {
            // Return an error if the user does not exist
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Return the updated user's data
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        // Log the error for debugging
        console.error(error);
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to update user' });
    }
});
exports.updateUser = updateUser;
/**
 * Delete user account (protected route, requires valid JWT)
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // Delete the user with the ID from the JWT
        const user = yield User_1.User.findByIdAndDelete((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!user) {
            // Return an error if the user does not exist
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Return a success response with a deletion message
        return res.status(200).json({ success: true, message: 'User account deleted successfully' });
    }
    catch (error) {
        // Log the error for debugging
        console.error(error);
        // Return an error response with a 500 status code
        return res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});
exports.deleteUser = deleteUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token not provided' });
        }
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        yield Token_1.Token.create({ token, expiresAt });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to log out' });
    }
});
exports.logoutUser = logoutUser;
