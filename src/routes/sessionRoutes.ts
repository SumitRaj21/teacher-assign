
import { Router } from "express";
import Joi from "joi";

// import {
//     createSession,
//     getAvailableSessions,
//     bookSession,
//     completeSession
// } from "../controllers/sessionController";
import SessionController from "../controllers/sessionController";

import validate from "../middlewares/validate.middleware";

import {
    createSessionSchema,
    getAvailableSessionsSchema,
    bookSessionSchema,
    completeSessionSchema
} from "../validations/sessionValidations";

const router = Router();

// Create a new session
router.post(
    "/",
    validate({ body: createSessionSchema }),
    SessionController.createSession
);

// Get available sessions
router.get(
    "/available",
    validate({ query: getAvailableSessionsSchema }),
    SessionController.getAvailableSessions
);

// Book a session
router.post(
    "/:id/book",
    validate({
        params: Joi.object({
            id: Joi.string().hex().length(24).required()
        }),
        body: bookSessionSchema
    }),
    SessionController.bookSession
);

// Complete a session
router.patch(
    "/:id/complete",
    validate({
        params: Joi.object({
            id: Joi.string().hex().length(24).required()
        })
    }),
    SessionController.completeSession
);

export default router;
