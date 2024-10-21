// controllers/voteController.js
const Vote = require('../models/vote');
const Poll = require('../models/poll');
const User = require('../models/user');

// Vote
exports.castVote = async (req, res) => {
    const { pollId, option } = req.body;

    if (!pollId || !option) {
        return res.status(400).json({ message: 'Poll ID and option are required.' });
    }

    try {
        // Check if the poll exists
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found.' });
        }

        // Check if the user has already voted
        const existingVote = await Vote.findOne({ pollId, userId: req.user.id });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted on this poll.' });
        }

        // Create the vote
        const newVote = new Vote({
            pollId,
            userId: req.user.id,
            option,
        });

        await newVote.save();

        // Update the votes in the poll
        poll.votes.set(option, (poll.votes.get(option) || 0) + 1);
        await poll.save();

        // Update User's votedPolls
        await User.findByIdAndUpdate(req.user.id, { $push: { votedPolls: pollId } });

        res.status(201).json({ message: 'Vote cast successfully', vote: newVote });
    } catch (error) {
        res.status(500).json({ message: 'Error casting vote', error: error.message });
    }
};
