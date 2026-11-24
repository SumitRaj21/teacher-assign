
import { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (
    err: unknown,
    _req,
    res,
    _next
) => {

    // MongoDB duplicate key error
    if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === 11000
    ) {
        return res.status(409).json({
            success: false,
            message: "A record with this unique value already exists"
        });
    }

    // Custom application error
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // MongoDB CastError
    if (
        err instanceof Error &&
        err.name === "CastError"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID or value"
        });
    }

    // MongoDB ValidationError
    if (
        err instanceof Error &&
        err.name === "ValidationError"
    ) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Unknown error
    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};
