const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoUri = process.env.MONGO_URI;
console.log(mongoUri);
const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log("MongoDB connection failed", error);
    }
}


module.exports = connectDB;                