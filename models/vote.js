const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll', // Reference to Poll model
        required: true,
        index: true, // Index for quick lookup of all votes on a poll
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
        index: true, // Index for batch-fetching all votes cast by a user
    },
    option: {
        type: String, // The option chosen by the user
        required: true,
    },
}, { timestamps: true });

// Indexes
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true }); // Unique index on pollId and userId
voteSchema.index({ pollId: 1 }); // Index on pollId
voteSchema.index({ userId: 1 }); // Index on userId

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
