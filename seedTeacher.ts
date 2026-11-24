
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/config/db.config";
import Teacher from "./src/models/teacherModel";

dotenv.config();

const seedTeacher = async (): Promise<void> => {
    try {
        await connectDB();

        const teacher = await Teacher.findOneAndUpdate(
            { email: "teacher.demo@example.com" },
            {
                fullName: "Demo Teacher",
                email: "teacher.demo@example.com",
                specialization: "Mathematics",
                experience: 5
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log("Demo teacher ID:", teacher._id.toString());

    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedTeacher();
