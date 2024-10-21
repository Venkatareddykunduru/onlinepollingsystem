const User = require('../models/user'); // Ensure correct case in the path
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User Registration
exports.createuser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user in the database
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Login
exports.loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '5h' }
    );

    // Respond with token and user status
    res.status(200).json({
      message: 'Login successful',
      token // Assuming `ispremium` field is optional
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.getUserInfo = (req, res) => {
    try {
        const user = req.user; // Assuming the user is already attached to req by authentication middleware

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude sensitive information like password
        const { password, ...userInfo } = user._doc;

        return res.status(200).json(userInfo);
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving user info', error: err });
    }
};
