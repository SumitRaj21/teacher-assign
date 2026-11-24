
import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
    fullName: string;
    email: string;
    phone: string;
}

const userSchema = new Schema<IUser>(
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
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
