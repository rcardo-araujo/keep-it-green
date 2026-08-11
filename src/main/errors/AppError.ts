export class AppError extends Error {
    constructor(
        public message: string,
        public code: string,
        public details?: any
    ) {
        super(message);
        this.name = "AppError";

        Error.captureStackTrace(this, this.constructor);
    }
}
