
import mongoose from "mongoose";
import Session from "../models/sessionModel";
import Teacher from "../models/teacherModel";
import User from "../models/userModel";
import AppError from "../utils/AppError";

interface CreateSessionData {
    teacherId: string;
    startTime: string | Date;
    endTime: string | Date;
}

class SessionService {
    createSession = async (sessionData: CreateSessionData) => {
        const { teacherId, startTime, endTime } = sessionData;

        if (!teacherId || !startTime || !endTime) {
            throw new AppError(
                400,
                "teacherId, startTime and endTime are required"
            );
        }

        if (!mongoose.isValidObjectId(teacherId)) {
            throw new AppError(400, "Invalid teacher ID");
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            throw new AppError(400, "Invalid date values");
        }

        if (end <= start) {
            throw new AppError(
                400,
                "endTime must be greater than startTime"
            );
        }

        if (!(await Teacher.exists({ _id: teacherId }))) {
            throw new AppError(404, "Teacher not found");
        }

        const session = await Session.create({
            teacherId,
            startTime: start,
            endTime: end,
            status: "AVAILABLE"
        });

        return session;
    };

    getAvailableSessions = async (dateTimestamp: string | number) => {
        const timestamp = Number(dateTimestamp);

        if (
            !dateTimestamp ||
            !Number.isFinite(timestamp)
        ) {
            throw new AppError(
                400,
                "dateTimestamp query parameter must be a valid timestamp in milliseconds"
            );
        }

        const day = new Date(timestamp);

        if (Number.isNaN(day.getTime())) {
            throw new AppError(
                400,
                "dateTimestamp must represent a valid date"
            );
        }

        const startOfDay = new Date(day);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(day);
        endOfDay.setUTCHours(24, 0, 0, 0);

        const sessions = await Session.aggregate([
            {
                $match: {
                    status: "AVAILABLE",
                    startTime: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }
            },
            {
                $lookup: {
                    from: "teachers",
                    localField: "teacherId",
                    foreignField: "_id",
                    as: "teacher"
                }
            },
            {
                $unwind: "$teacher"
            },
            {
                $project: {
                    teacherId: 1,
                    startTime: 1,
                    endTime: 1,
                    status: 1,
                    teacher: {
                        fullName: 1,
                        specialization: 1,
                        experience: 1,
                        email: 1
                    }
                }
            },
            {
                $sort: {
                    startTime: 1
                }
            }
        ]);

        return sessions;
    };

    bookSession = async (sessionId: string, userId: string) => {
        if (!userId) {
            throw new AppError(400, "userId is required");
        }

        if (
            !mongoose.isValidObjectId(sessionId) ||
            !mongoose.isValidObjectId(userId)
        ) {
            throw new AppError(
                400,
                "Invalid session or user ID"
            );
        }

        if (!(await User.exists({ _id: userId }))) {
            throw new AppError(404, "User not found");
        }

        const session = await Session.findOneAndUpdate(
            {
                _id: sessionId,
                status: "AVAILABLE"
            },
            {
                $set: {
                    status: "BOOKED",
                    userId
                }
            },
            {
                new: true
            }
        );

        if (!session) {
            const exists = await Session.exists({
                _id: sessionId
            });

            if (!exists) {
                throw new AppError(404, "Session not found");
            }

            throw new AppError(
                409,
                "Session is not available for booking"
            );
        }

        return session;
    };

    completeSession = async (sessionId: string) => {
        if (!mongoose.isValidObjectId(sessionId)) {
            throw new AppError(400, "Invalid session ID");
        }

        const session = await Session.findOneAndUpdate(
            {
                _id: sessionId,
                status: "BOOKED"
            },
            {
                $set: {
                    status: "COMPLETED",
                    completedAt: new Date()
                }
            },
            {
                new: true
            }
        );

        if (!session) {
            const exists = await Session.exists({
                _id: sessionId
            });

            if (!exists) {
                throw new AppError(404, "Session not found");
            }

            throw new AppError(
                409,
                "Only BOOKED sessions can be completed"
            );
        }

        return session;
    };
}

export default new SessionService();
