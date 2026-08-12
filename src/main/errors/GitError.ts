import { AppError } from "./AppError";

export class GitError extends AppError {
    constructor(
        public repository: string,
        error: string
    ) {
        const message = `Git error [${repository}]: ${error}`;
        const details = { repository: repository };

        super(message, "GIT_COMMAND_FAILED", details)
        this.name = "GitError";
    }
}
