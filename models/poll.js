const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        type: String, // Storing options as strings; could be ObjectId if using an Option model
        required: true,
    }],
    votes: {
        type: Map,
        of: Number, // Stores vote counts for each option
        default: {},
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
        index: true, // Index for quickly finding polls created by a specific user
    },
}, { timestamps: true });

// Indexes
pollSchema.index({ creatorId: 1 }); // Index on creatorId
pollSchema.index({ createdAt: -1 }); // Optional: Index on createdAt timestamp

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;
