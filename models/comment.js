const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll', // Reference to Poll model
        required: true,
        index: true, // Index for fetching comments for a specific poll
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
        index: true, // Index for retrieving all comments made by a user
    },
    comment: {
        type: String,
        required: true,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Reference to Comment model for replies
        default: null, // Null for top-level comments
        index: true, // Index for efficient fetching of top-level comments and replies
    },
    level: {
        type: Number,
        default: 0, // Nesting level (0 for top-level, 1 for replies)
    },
}, { timestamps: true });

// Indexes
commentSchema.index({ pollId: 1, parentCommentId: 1 }); // Compound index on pollId and parentCommentId
commentSchema.index({ userId: 1 }); // Index on userId
commentSchema.index({ createdAt: -1 }); // Optional: Index on createdAt timestamp

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
