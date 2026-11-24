
import { Router } from "express";

// import {
//     createUser,
//     getUserSessions
// } from "../controllers/userController";
import UserController from "../controllers/userController";

import validate from "../middlewares/validate.middleware";

import {
    createUserSchema,
    getUserSessionsSchema
} from "../validations/userValidations";

const router = Router();

// Create a new user
router.post(
    "/",
    validate({ body: createUserSchema }),
    UserController.createUser
);

// Get user sessions
router.get(
    "/:id/sessions",
    validate({ params: getUserSessionsSchema }),
    UserController.getUserSessions
);

export default router;
