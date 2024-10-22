const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import routes
const userAuthRoutes = require('./routes/user');
const pollRoutes = require('./routes/poll');
const voteRoutes = require('./routes/vote');
const commentRoutes = require('./routes/comment');

//Import models

const Vote = require('./models/vote'); 
const Poll = require('./models/poll'); 
const Comment = require('./models/comment'); 
const User = require('./models/user');

// Connect to the database
const { connectToDatabase } = require('./util/database');
const websocketauthenticate=require('./middleware/websocketauthenticate');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

io.use(websocketauthenticate);






const activePolls = {}; // To track users' current polls

io.on('connection', (socket) => {
    console.log('User connected');

    // Handle joining a poll
    socket.on('joinPoll', (pollId) => {
        // Leave the previous poll if the user is already in one
        if (activePolls[socket.id]) {
            socket.leave(activePolls[socket.id]);
            console.log(`User left poll ${activePolls[socket.id]}`);
        }

        // Join the new poll
        socket.join(pollId);
        activePolls[socket.id] = pollId; // Update the active poll for this socket
        console.log(`User joined poll ${pollId}`);
    });

    // Handle voting
    socket.on('vote', async ({pollId, option}) => {
        console.log(pollId);
        console.log(option);
        if (!pollId || !option) {
            return socket.emit('voteError', { message: 'Poll ID and option are required.' });
        }

        try {
            // Check if the poll exists
            const poll = await Poll.findById(pollId);
            if (!poll) {
                return socket.emit('voteError', { message: 'Poll not found.' });
            }

            // Check if the user has already voted
            const existingVote = await Vote.findOne({ pollId, userId: socket.user.id });
            if (existingVote) {
                return socket.emit('voteError', { message: 'You have already voted on this poll.' });
            }

            // Create the vote
            const newVote = new Vote({
                pollId,
                userId: socket.user.id,
                option,
            });

            await newVote.save();

            // Update the votes in the poll
            poll.votes.set(option, (poll.votes.get(option) || 0) + 1);
            await poll.save();

            // Update User's votedPolls
            await User.findByIdAndUpdate(socket.user.id, { $push: { votedPolls: pollId } });

            // Emit the new vote to all clients in the room
            const updatedPoll = await Poll.findById(pollId);
            io.emit('newVote', { message: 'Vote cast successfully', vote: newVote });
            io.emit('updateVotes', updatedPoll);
        } catch (error) {
            console.error('Error casting vote:', error);
            socket.emit('voteError', { message: 'Error casting vote', error: error.message });
        }
    });

    // Handle commenting
    socket.on('newComment', async ({pollId,comment,parentCommentId}) => {
        try {
            // Check if poll exists
            const poll = await Poll.findById(pollId);
            if (!poll) {
                return socket.emit('commentError', { message: 'Poll not found' });
            }

            // const { comment, parentCommentId } = commentData;

            // Determine if it's a top-level comment or a reply
            let level = 0; // Default level for top-level comment
            if (parentCommentId) {
                const parentComment = await Comment.findById(parentCommentId);
                if (!parentComment) {
                    return socket.emit('commentError', { message: 'Parent comment not found' });
                }
                level = parentComment.level + 1; // Increase nesting level for replies
            }

            // Create the new comment
            const newComment = new Comment({
                pollId,
                userId: socket.user.id, // From authenticated user
                comment,
                parentCommentId: parentCommentId || null, // If top-level, parentCommentId is null
                level,
            });

            // Save the comment
            await newComment.save();

            // Emit the new comment to all clients in the room
            //io.to(pollId).emit('updateComments', { message: 'Comment added successfully', newComment });
            io.emit('newComment', newComment);
        } catch (error) {
            console.error('Error adding comment:', error);
            socket.emit('commentError', { message: 'Server error' });
        }
    });

    // Handle disconnecting
    socket.on('disconnect', () => {
        // Remove the user from the activePolls tracking
        delete activePolls[socket.id];
        console.log('User disconnected');
    });
});








// Use routes
app.use('/auth', userAuthRoutes);
app.use('/poll', pollRoutes);
app.use('/votes', voteRoutes);
app.use('/comments', commentRoutes);

// 
app.use((req, res) => {
    let filePath;
    if (req.path === '/') {
        // Redirect to the login page
        filePath=path.join(__dirname,'public','/login.html');
    } else {
        // Serve the requested file from the public directory
        filePath = path.join(__dirname, 'public', req.path); // Use req.path to ignore query strings
    }
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(err.status).send(err.message); // Handle error if the file is not found
        }
    });
});
// Start server after database connection
(async () => {
  try {
    await connectToDatabase(); // Wait for database connection
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server is listening on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.log('Unable to start server: ' + err);
  }
})();
