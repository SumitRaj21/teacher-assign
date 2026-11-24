
class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;

        // Maintain correct prototype inheritance
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export default AppError;
