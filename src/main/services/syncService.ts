import { SyncProfile } from "../models/SyncProfile";
import { leaveCommitFootprints } from "./footprintService";
import { createCommit, fetchCommits, pushCommits, stageChanges } from "./gitClient";
import { SyncHistoryRepository } from "../databases/db";

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

                await pushCommits(repo);

                commitsSynced += commits.length;
            } catch (error) {
                console.warn(`Failed to sync repository ${repo}: `, error);
                continue;
            }
        }

        await SyncHistoryRepository.recordSyncRun(commitsSynced);
    } catch (error) {
        console.log("Sync error: ", error);
        throw(error);
    } finally {
        isSyncing = false;
    }
}
