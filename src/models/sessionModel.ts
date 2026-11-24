
import mongoose, { Schema, Model } from "mongoose";

export const SESSION_STATUS = Object.freeze({
    AVAILABLE: "AVAILABLE",
    BOOKED: "BOOKED",
    COMPLETED: "COMPLETED"
} as const);

export type SessionStatus =
    (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

export interface ISession {
    teacherId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | null;
    startTime: Date;
    endTime: Date;
    status: SessionStatus;
    completedAt: Date | null;
}

const sessionSchema = new Schema<ISession>(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(SESSION_STATUS),
            default: SESSION_STATUS.AVAILABLE,
            required: true
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Indexes
sessionSchema.index({ status: 1, startTime: 1 });
sessionSchema.index({ userId: 1, status: 1, startTime: 1 });

const Session: Model<ISession> =
    mongoose.model<ISession>("Session", sessionSchema);

export default Session;
