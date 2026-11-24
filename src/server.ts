
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db.config";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error: unknown) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

startServer();
