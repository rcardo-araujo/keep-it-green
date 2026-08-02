import { SyncProfile } from "./models/SyncProfile";
import { updateLastSyncDate } from "./configManager";
import { leaveCommitFootprints } from "./footprintService";
import { createCommit, fetchCommits, pushCommits, stageChanges } from "./gitClient";

export async function runSync(syncProfile: SyncProfile, lastSyncDate: string) {
    try {
        await updateLastSyncDate();

        for (const repo of syncProfile.sourceRepoPaths) {
            const shouldPreserveMessage: boolean = syncProfile.repoPrivacies[repo] ?? true;

            const commits = await fetchCommits(repo, syncProfile.authorEmail, lastSyncDate); 

            for (const commit of commits) {
                await leaveCommitFootprints(commit, syncProfile.destinationRepoPath);
                await stageChanges(syncProfile.destinationRepoPath);

                if (shouldPreserveMessage) commit.message = null;
                await createCommit(syncProfile.destinationRepoPath, commit.message, commit.date);
            }

            await pushCommits(repo);
        }
    } catch (error) {
        console.log("Sync error: ", error);
        throw(error);
    }
}
