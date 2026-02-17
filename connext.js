import mongoose from "mongoose";

const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Pokemon_noSQL');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

connect();  