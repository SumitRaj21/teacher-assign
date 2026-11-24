
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        console.log("Connecting to MongoDB...");

        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("MongoDB connected successfully ✅");
        console.log("Host:", mongoose.connection.host);
        console.log("Database:", mongoose.connection.name);

    } catch (error: unknown) {
        console.error("MongoDB connection failed ❌");

        if (error instanceof Error) {
            console.error("Error message:", error.message);
        } else {
            console.error("Unknown database connection error:", error);
        }

        process.exit(1);
    }
};

export default connectDB;
