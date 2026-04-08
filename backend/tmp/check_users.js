import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config({ path: '../.env' });

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hiremind');
        const count = await User.countDocuments();
        console.log(`Number of users in database: ${count}`);
        const users = await User.find({}, '_id name email');
        console.log('Users:', users);
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
};

checkUsers();
