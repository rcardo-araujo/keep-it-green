import { AppError } from "./AppError";

export class DatabaseError extends AppError {
    constructor(
        operation: string,
        details: any
    ) {
        const message = `Database failure during the operation: ${operation}`;

        super(message, "DATABASE_FAILED", details);
        this.name = "DatabaseError";
    }
}
