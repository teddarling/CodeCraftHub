import User from '../models/userModel.js'; // Import the User model for interacting with the user collection
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing passwords
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for generating JWT tokens
import { jwtSecret } from '../config/config.js'; // Import the JWT secret from configuration

/**
 * Register a new user.
 * 
 * This endpoint handles user registration by checking if the user already exists,
 * hashing the password, and saving the new user to the database.
 * 
 * @param {Object} req - The request object containing user details in req.body
 * @param {Object} res - The response object to send back the result
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the provided password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Log the error for debugging
    console.error('Error registering user:', error);

    // Respond with a server error status
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Authenticate a user.
 * 
 * This endpoint handles user login by verifying the user's credentials and generating a JWT token.
 * 
 * @param {Object} req - The request object containing user login details in req.body
 * @param {Object} res - The response object to send back the result
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Check if a user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

    // Respond with the generated token
    res.json({ token });
  } catch (error) {
    // Log the error for debugging
    console.error('Error logging in user:', error);

    // Respond with a server error status
    res.status(500).json({ message: 'Server error' });
  }
};
