import { CommitData } from "./models/CommitData";
import { LanguageFileExtentions } from "./registry/LanguageFileExtentions";

import { exec } from "child_process";
import { promisify } from "util"; 
import * as path from "path";

const execAsync = promisify(exec);

async function executeGitCommand(command: string, repository: string): Promise<string> {
    try {
        const { stdout, stderr } = await execAsync(command, { cwd: repository });

        if (stderr) {
            console.warn("Git info: ", stderr);
        }

        return stdout;
    } catch(error) {
        console.log("Git error: ", error);
        throw(error)
    }
}

export async function stageChanges(repository: string): Promise<void> {
    const command = `git add .`;
    await executeGitCommand(command, repository);
}

export async function fetchCommits(repository: string, author: string, sinceDate: string): Promise<CommitData[]> {
    const command = `git --no-pager log --reverse --author="${author}" --since="${sinceDate}" --numstat --pretty=format:"date=%ad message=%s" --date=short`;
    const rawCommits = await executeGitCommand(command, repository);
    
    return extractCommitData(rawCommits);
}

export async function createCommit(repository: string, message: string | null, date: string): Promise<void> {
    const command = `git commit --allow-empty -m ${message ? `"${message}"` : `"private commit message"`} --date=${date}`;
    await executeGitCommand(command, repository);
}

export async function pushCommits(repository: string): Promise<void> {
    const command = `git push`;
    await executeGitCommand(command, repository);
}

function extractCommitData(rawCommits: string): CommitData[] {
    const commits: CommitData[] = [];
    const lines: string[] = rawCommits.split("\n");
    
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
                
                const fileExtension = path.extname(filePath).slice(1);
                const language = LanguageFileExtentions[fileExtension];
                if (language) {
                    currCommit.addInsertions(language, numInsertions);
                }
            }
        }
    }

    return commits;
}
