Real Time Polling System:

Overview:

This is a Real-time Polling System built using stack (MongoDB, Express, javascript, Node.js).
It allows users to create polls, vote, comment on polls, and view real-time updates as other users participate.
The application also supports user authentication, real-time notifications via Socket.IO, and a comprehensive user profile.

Features:

Poll Creation: Users can create polls with multiple options.
Voting: Users can vote on polls, with restrictions ensuring each user can only vote once per poll.
Comments: Real-time comment system allowing users to engage in discussions about polls.
User Authentication: Secure user login and registration using JWT (JSON Web Tokens).
Real-time Notifications: Poll updates and comments are displayed in real-time using Socket.IO.
User Profiles: Each user can view their profile, including polls they’ve created and voted on

Tech Stack:

Frontend: Javascript
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ORM)
Real-time: Socket.IO
Authentication: JWT (JSON Web Tokens)


Setup and Installation:
To run the project locally, follow these steps:

Prerequisites:
Node.js installed
MongoDB installed locally or use a cloud-based MongoDB instance (e.g., MongoDB Atlas)
Git installed for version control

installation steps:

-->git clone https://github.com/Venkatareddykunduru/onlinepollingsystem.git
-->cd onlinepollingsystem
-->npm install

Environment Variables:
Create a .env file in the backend directory and add the following environment variables:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/polling-system
JWT_SECRET=your_jwt_secret_key

API Endpoints:

Auth
Register a New User
URL: http://localhost:3000/auth/register
Method: POST

User Login
URL: http://localhost:3000/auth/login
Method: POST

Get User Information
URL: http://localhost:3000/auth/userinfo
Method: GET

Polls

Create a Poll
URL: http://localhost:3000/poll/create
Method: POST

Get All Polls
URL: http://localhost:3000/poll/getallpolls
Method: GET

Get Poll by ID
URL: http://localhost:3000/poll/6714b36a1a460432904de2b8
Method: GET

Get All Comments for a Poll
URL: http://localhost:3000/comments/allcomments/67153cf46106d8f2efd70eba
Method: GET

Real-time Features
The application uses Socket.IO for real-time functionality, such as:

Real-time voting results
Real-time commenting on polls
