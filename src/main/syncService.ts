import { SyncProfile } from "./models/SyncProfile";
import { leaveCommitFootprints } from "./footprintService";
import { createCommit, fetchCommits, pushCommits, stageChanges } from "./gitClient";
import { SyncHistoryRepository } from "./databases/db";

export async function runSync(syncProfile: SyncProfile) {
    try {
        const history = SyncHistoryRepository.getHistory();
        
        const dateToUse = history.lastSyncDate || syncProfile.initialSyncDate || "";

        let commitsSynced = 0;
        for (const repo of syncProfile.sourceRepoPaths) {
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
        }

        await SyncHistoryRepository.recordSyncRun(commitsSynced);
    } catch (error) {
        console.log("Sync error: ", error);
        throw(error);
    }
}
