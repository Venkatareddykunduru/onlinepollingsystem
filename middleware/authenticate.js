const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.authenticate = async function(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const user = await User.findById(decoded.id); // Mongoose method
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid user' });
        }
        req.user = user; // Attach user object to req.user
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
