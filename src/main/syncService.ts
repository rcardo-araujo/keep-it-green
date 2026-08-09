import { SyncProfile } from "./models/SyncProfile";
import { updateLastSyncDate } from "./configManager";
import { leaveCommitFootprints } from "./footprintService";
import { createCommit, fetchCommits, pushCommits, stageChanges } from "./gitClient";
import { metricsRepository } from "./databases/db";

export async function runSync(syncProfile: SyncProfile) {
    try {
        await updateLastSyncDate();

        let totalCommitsSync = 0;
        for (const repo of syncProfile.sourceRepoPaths) {
            const shouldPreserveMessage: boolean = syncProfile.repoPrivacies[repo] ?? true;

            const commits = await fetchCommits(repo, syncProfile.authorEmail, syncProfile.lastSyncDate); 

            for (const commit of commits) {
                await leaveCommitFootprints(commit, syncProfile.destinationRepoPath);
                await stageChanges(syncProfile.destinationRepoPath);

                if (!shouldPreserveMessage) commit.message = null;
                await createCommit(syncProfile.destinationRepoPath, commit.message, commit.date);
            }

            await pushCommits(repo);

            totalCommitsSync += commits.length;
        }

        await metricsRepository.addToTotalCommits(totalCommitsSync);
    } catch (error) {
        console.log("Sync error: ", error);
        throw(error);
    }
}
