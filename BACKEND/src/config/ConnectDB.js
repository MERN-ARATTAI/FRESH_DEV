import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database_Created ✅");

    } catch (error) {
        console.log("Database_Error", error.message)
        process.exit(1)
    }
}

export default connectDB;