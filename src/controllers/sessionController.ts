
import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";
import sessionService from "../services/sessionService";

class SessionController {

    // Create a new session
    createSession = asyncHandler(async (req: Request, res: Response) => {
        const session = await sessionService.createSession(req.body);

        res.status(201).json({
            success: true,
            message: "Session created successfully",
            data: session
        });
    });

    // Get available sessions
    getAvailableSessions = asyncHandler(async (req: Request, res: Response) => {
        const sessions = await sessionService.getAvailableSessions(
            req.query.startTime as string
        );

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    });

    // Book a session
    bookSession = asyncHandler(async (req: Request, res: Response) => {
        const session = await sessionService.bookSession(
            req.params.id as string, //req.params.id,
            req.body.userId
        );

        res.status(200).json({
            success: true,
            message: "Session booked successfully",
            data: session
        });
    });

    // Complete a session
    completeSession = asyncHandler(async (req: Request, res: Response) => {
        const session = await sessionService.completeSession(
            req.params.id as string
        );

        res.status(200).json({
            success: true,
            message: "Session completed successfully",
            data: session
        });
    });
}

export default new SessionController();
