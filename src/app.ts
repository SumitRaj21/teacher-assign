
import express, { Request, Response } from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/health", (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: "API is running"
    });
});

// Routes
app.use("/users", userRoutes);
app.use("/sessions", sessionRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
