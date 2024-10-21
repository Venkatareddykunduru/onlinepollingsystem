// controllers/pollController.js
const Poll = require('../models/poll');
const User = require('../models/user');

// Create Poll
exports.createPoll = async (req, res) => {
    const { question, options } = req.body;
    console.log('this is create poll request');
    console.log(req.user);
    if (!question || !options || options.length < 2) {
        return res.status(400).json({ message: 'Question and at least two options are required.' });
    }

    try {
        const newPoll = new Poll({
            question,
            options,
            creatorId: req.user.id, // Assuming user ID is available in req.user after authentication
        });

        await newPoll.save();

        // Update User's createdPolls
        await User.findByIdAndUpdate(req.user.id, { $push: { createdPolls: newPoll._id } });

        res.status(201).json({ message: 'Poll created successfully', poll: newPoll });
    } catch (error) {
        res.status(500).json({ message: 'Error creating poll', error: error.message });
    }
};


exports.getAllPolls = async (req, res) => {
    try {
        // Fetch all polls from the database
        const polls = await Poll.find({}).populate('creatorId', 'name'); // Optional: populate creator info

        // Create a response array with hasVoted status
        const response = polls.map(poll => {
            return {
                _id: poll._id,
                question: poll.question,
                options: poll.options,
                votes: poll.votes,
                creatorId: poll.creatorId,
                hasVoted: req.user.votedPolls.includes(poll._id), // Check if user has voted for this poll
                createdAt: poll.createdAt,
                updatedAt: poll.updatedAt
            };
        });

        return res.status(200).json({ polls: response });
    } catch (error) {
        console.error('Error fetching polls:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.getPollById = async (req, res) => {
    try {
        const { pollId } = req.params;

        // Fetch the poll by its ID
        const poll = await Poll.findById(pollId).populate('creatorId', 'name'); // Populate creator info

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Return the poll details directly, as votes are already stored in the document
        return res.status(200).json({
            _id: poll._id,
            question: poll.question,
            options: poll.options,
            votes: poll.votes,          // Vote counts stored in poll document
            creatorId: poll.creatorId,
            createdAt: poll.createdAt,   // Timestamp for poll creation
            updatedAt: poll.updatedAt
        });
    } catch (error) {
        console.error('Error fetching poll:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};