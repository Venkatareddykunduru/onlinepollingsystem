const mongoose = require('mongoose');
require('dotenv').config();

const uri = 'mongodb+srv://venkatareddykunduru123:Lachhi%40143@cluster0.utyug.mongodb.net/';
let isConnected;
const connectToDatabase = async () => {
    if (isConnected) {
        return; // Connection already established
    }
    
    try {
        await mongoose.connect(uri, {
            dbName:'pollingsystem'
        });
        console.log('MongoDB connected successfully');
        isConnected=true;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = { connectToDatabase };
