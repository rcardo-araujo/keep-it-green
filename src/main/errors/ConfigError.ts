import { AppError } from "./AppError";

export class ConfigError extends AppError {
    constructor(
        operation: string,
        details: any
    ) {
        const message = `Configuration failure during operation: ${operation}`;

        super(message, "CONFIG_FAILED", details);
        this.name = "ConfigError";
    }
}
