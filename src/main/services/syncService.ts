import { SyncProfile } from "../models/SyncProfile";
import { leaveCommitFootprints } from "./footprintService";
import { createCommit, fetchCommits, pushCommits, stageChanges } from "./gitClient";
import { SyncHistoryRepository } from "../databases/db";
import { GitError } from "../errors/GitError";
import { DatabaseError } from "../errors/DatabaseError";
import { AppError } from "../errors/AppError";

let isSyncing = false;

export async function runSync(syncProfile: SyncProfile) {
    if (isSyncing) {
        console.warn("Sync is already in progress. Skipping this execution.");
        return;
    }

    isSyncing = true;
    
    try {
        const history = SyncHistoryRepository.getHistory();
        
        const dateToUse = history.lastSyncDate || syncProfile.initialSyncDate || "";

        let commitsSynced = 0;
        for (const repo of syncProfile.sourceRepoPaths) {
            try {
                const shouldPreserveMessage: boolean = syncProfile.repoPrivacies[repo] ?? true;

                const commits = await fetchCommits(repo, syncProfile.authorEmail, dateToUse); 

                for (const commit of commits) {
                    await leaveCommitFootprints(commit, syncProfile.destinationRepoPath);
                    await stageChanges(syncProfile.destinationRepoPath);

                    if (!shouldPreserveMessage) commit.message = null;
                    await createCommit(syncProfile.destinationRepoPath, commit.message, commit.date);
                }

                commitsSynced += commits.length;
            } catch (error: any) {
                if (error instanceof GitError)
                    console.warn(`[GIT ERROR] Syncronization failed in the repository ${repo}. Reason: ${error.message}`);
                else 
                    console.error(`[FATAL] Unknown error in the repository ${repo}: `, error);

                continue;
            }
        }

        if (commitsSynced > 0) {
            await pushCommits(syncProfile.destinationRepoPath);
        }

        await SyncHistoryRepository.recordSyncRun(commitsSynced);
    } catch (error: any) {
        if (error instanceof DatabaseError)
            console.error(`[DATABASE FATAL] ${error.message}`, error.details);
        else if (error instanceof AppError) 
            console.error(`[APP FATAL] ${error.message}`);
        else
            console.error(`[FATAL] ${error.message}`, error.details);

        throw error;
    } finally {
        isSyncing = false;
    }
}
