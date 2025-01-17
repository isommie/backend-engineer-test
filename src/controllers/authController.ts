import { Request, Response } from 'express';
import { User } from '../models/User';
import { hashHelper } from '../utils/hashHelper';
import { jwtHelper } from '../utils/jwtHelper';
import { Token } from '../models/Token';

/**
 * Handle user registration
 */
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract email, password, and username from the request body
    const { email, password, username } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Return an error if the email is already registered
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Hash the user's password using hashHelper
    const hashedPassword = await hashHelper.hashPassword(password);
    const user = new User({ email, password: hashedPassword, username });
    // Save the new user to the database
    await user.save();

    // Return a success response with the new user's data
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to register user' });
  }
};

/**
 * Handle user login
 */
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      // Return an error if the user does not exist
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password using hashHelper
    const isMatch = await hashHelper.comparePassword(password, user.password);
    if (!isMatch) {
      // Return an error if the passwords do not match
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate a JSON Web Token (JWT) with the user's ID
    const token = jwtHelper.signToken({ id: user._id });
    // Return a success response with the JWT
    return res.status(200).json({ success: true, token });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to login' });
  }
};

/**
 * Get user details (protected route, requires valid JWT)
 */
export const getUserDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Find the user with the ID from the JWT
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      // Return an error if the user does not exist
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Return the user's details with the password omitted
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to get user details' });
  }
};

/**
 * Update user details (protected route, requires valid JWT)
 */
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract username and email from the request body
    const { username, email } = req.body;
    // Update the user's details with the provided data
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { username, email },
      { new: true, runValidators: true } // Run validation on the updated data
    );

    if (!user) {
      // Return an error if the user does not exist
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Return the updated user's data
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

/**
 * Delete user account (protected route, requires valid JWT)
 */
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Delete the user with the ID from the JWT
    const user = await User.findByIdAndDelete(req.user?.id);
    if (!user) {
      // Return an error if the user does not exist
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Return a success response with a deletion message
    return res.status(200).json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    // Return an error response with a 500 status code
    return res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token not provided' });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await Token.create({ token, expiresAt });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to log out' });
  }
};
