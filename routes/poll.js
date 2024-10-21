// routes/pollRoutes.js
const express = require('express');
const { createPoll,getAllPolls,getPollById } = require('../controllers/poll');
const { authenticate } = require('../middleware/authenticate'); // Middleware to check authentication

const router = express.Router();

// Create Poll Route
router.post('/create', authenticate, createPoll);
router.get('/getallpolls',authenticate, getAllPolls);
router.get('/:pollId',authenticate,getPollById);
module.exports = router;
