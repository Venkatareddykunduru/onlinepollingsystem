// routes/voteRoutes.js
const express = require('express');
const { castVote } = require('../controllers/vote');
const { authenticate } = require('../middleware/authenticate'); // Middleware to check authentication

const router = express.Router();

// Vote Route
router.post('/vote', authenticate, castVote);

module.exports = router;
