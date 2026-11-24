
import mongoose, { Schema, Model } from "mongoose";

export interface ITeacher {
    fullName: string;
    email: string;
    specialization: string;
    experience: number;
}

const teacherSchema = new Schema<ITeacher>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        specialization: {
            type: String,
            required: true,
            trim: true
        },
        experience: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Teacher: Model<ITeacher> = mongoose.model<ITeacher>(
    "Teacher",
    teacherSchema
);

export default Teacher;
