const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config(); 
module.exports = async (socket, next) => {
  //console.log("socket",socket);
    const token = socket.handshake.auth.token;
    console.log('token: '+token);
    if (!token) {
      console.log('AuthenticationError');
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      console.log(decoded);
      const user = await User.findById(decoded.id);
      if (!user) {
        console.log('No user found');
        return next(new Error('Authentication error'));
      }
      socket.user = user;
      next();
    } catch (error) {
      console.log('catch blocked called');
      next(new Error('Authentication error'));
    }
};