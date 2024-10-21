const Comment = require('../models/comment');
const Poll = require('../models/poll');

// Add a comment (either top-level or reply)
exports.addComment = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { comment, parentCommentId } = req.body;

        // Check if poll exists
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Determine if it's a top-level comment or a reply
        let level = 0; // Default level for top-level comment
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
            level = parentComment.level + 1; // Increase nesting level for replies
        }

        // Create the new comment
        const newComment = new Comment({
            pollId,
            userId: req.user._id, // From authenticated user
            comment,
            parentCommentId: parentCommentId || null, // If top-level, parentCommentId is null
            level,
        });

        // Save the comment
        await newComment.save();

        return res.status(201).json({ message: 'Comment added successfully', newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.getComments = async (req, res) => {
    const { pollId } = req.params;
    const { parentCommentId } = req.query; // Use query parameter to optionally pass parentCommentId

    try {
        const query = { pollId };

        // If parentCommentId is provided, fetch replies, otherwise fetch top-level comments
        if (parentCommentId) {
            query.parentCommentId = parentCommentId;
        } else {
            query.parentCommentId = null;
        }

        const comments = await Comment.find(query).sort({ createdAt: -1 });
        return res.status(200).json(comments);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching comments', error: err });
    }
};


exports.getAllComments = async (req, res) => {
    const { pollId } = req.params;

    try {
        // Fetch all comments for the poll
        const comments = await Comment.find({ pollId }).sort({ createdAt: -1 });

        // Function to build the tree structure
        const buildCommentTree = (comments) => {
            const commentMap = {};
            const root = [];

            // Initialize each comment with an empty replies array
            comments.forEach(comment => {
                commentMap[comment._id] = { ...comment._doc, replies: [] };
            });

            // Build the tree
            comments.forEach(comment => {
                if (comment.parentCommentId) {
                    // If the comment has a parent, add it to the parent's replies array
                    commentMap[comment.parentCommentId].replies.push(commentMap[comment._id]);
                } else {
                    // If it's a top-level comment, add it to the root array
                    root.push(commentMap[comment._id]);
                }
            });

            return root;
        };

        // Organize the comments into a tree
        const commentTree = buildCommentTree(comments);

        return res.status(200).json(commentTree);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching comments', error: err });
    }
};


