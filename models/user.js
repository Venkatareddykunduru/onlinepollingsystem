const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        index: true, 
    },
    password: {
        type: String,
        required: true, // Password is required
    },
    profilePicture: {
        type: String,
        default: null, //path to the user's profile picture
    },
    createdPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll', // Reference to Poll model for polls created by the user
    }],
    votedPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll', // Reference to Poll model for polls the user has voted on
    }],
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 }, { unique: true }); // Unique index on email
userSchema.index({ name: 1 }); // Index on name
userSchema.index({ createdAt: -1 }); // Optional: Index on createdAt timestamp

const User = mongoose.model('User', userSchema);
module.exports = User;
