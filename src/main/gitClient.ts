import { exec } from "child_process";
import { promisify } from "util"; 

class CommitData {
    date: string = "";
    message: string = "";
    tsInsertions: number = 0;

    public addTsInsertions(quantity: number): void {
        if (!isNaN(quantity) && quantity > 0) {
            this.tsInsertions += quantity;
        }
    }
}

const execAsync = promisify(exec);

export async function stageChanges(repository: string): Promise<void> {
    const command = `git add .`;

    try {
        const { stderr } = await execAsync(command, { cwd: repository });

        if (stderr) {
            console.warn("Git info: ", stderr);
        }
    } catch(error) {
        console.log("Git error: ", error);
        throw(error)
    }
}

export async function fetchCommits(repository: string, author: string, sinceDate: string): Promise<CommitData[]> {
    const command = `git --no-pager log --author="${author}" --since="${sinceDate}" --numstat --pretty=format:"date=%ad message=%s" --date=short`;

    try {
        const { stdout, stderr } = await execAsync(command, { cwd: repository });

        if (stderr) {
            console.warn("Git info: ", stderr);
        }

        return extractCommitData(stdout);
    } catch (error) {
        console.log("Git error: ", error);
        throw(error);
    }
}

export async function emptyCommit(repository: string, message: string | null, date: string): Promise<void> {
    const command = `git commit --allow-empty ${message ? `-m "${message}"` : "private commit message"} --date=${date}`;

    try {
        const { stderr } = await execAsync(command, { cwd: repository });

        if (stderr) {
            console.warn("Git info: ", stderr);
        }
    } catch(error) {
        console.log("Git error: ", error);
        throw(error)
    }
}

export async function pushCommits(repository: string): Promise<void> {
    const command = `git push`;

    try {
        const { stderr } = await execAsync(command, { cwd: repository });

        if (stderr) {
            console.warn("Git info: ", stderr);
        }
    } catch (error) {
        console.log(error);
        throw(error);
    }
}

function extractCommitData(log: string): CommitData[] {
    const commits: CommitData[] = [];
    const lines: string[] = log.split("\n");
    
    let currCommit: CommitData | null = null;

    for (const line of lines) {
        if (line.startsWith("date")) {
            currCommit = new CommitData();

            const commitArgsRegex = /^date=(.*?)\s+message=(.*)$/;
            const commitArgs = line.match(commitArgsRegex);

            if (commitArgs) {
                currCommit.date = commitArgs[1];
                currCommit.message = commitArgs[2];
            }

            commits.push(currCommit)
        }
        else if ((currCommit !== null)) {
            const numstatArgsRegex = /^(\d+|-)\s+(\d+|-)\s+(.*)$/;
            const numstatArgs = line.match(numstatArgsRegex);
            
            if (numstatArgs) {
                const numInsertions = parseInt(numstatArgs[1]);
                const filePath = numstatArgs[3];

                if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
                    currCommit.addTsInsertions(numInsertions);
                }
            }
        }
    }

    return commits;
}
