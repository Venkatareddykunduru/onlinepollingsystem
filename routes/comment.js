const express = require('express');
const router = express.Router();
const { addComment,getComments, getAllComments } = require('../controllers/comment');
const { authenticate } = require('../middleware/authenticate'); // Middleware to authenticate user

// POST a new comment (top-level or reply) to a specific poll
router.post('/:pollId', authenticate, addComment);

// GET all comments for a specific poll (with replies nested)
router.get('/:pollId', authenticate, getComments);

router.get('/allcomments/:pollId',authenticate,getAllComments);

module.exports = router;
