
import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";
import userService from "../services/userService";

class UserController {

    createUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    });

    getUserSessions = asyncHandler(async (req: Request, res: Response) => {
        const sessions = await userService.getUserSessions(req.params.id as string);

        res.status(200).json({
            success: true,
            data: sessions
        });
    });
}

export default new UserController();
