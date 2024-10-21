const express = require('express');
const { createuser, loginuser,getUserInfo } = require('../controllers/user'); // Adjust the path as necessary
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Route to create a new user
router.post('/register', createuser);

// Route to log in a user
router.post('/login', loginuser);

router.get('/userinfo',authenticate,getUserInfo);

module.exports = router;
