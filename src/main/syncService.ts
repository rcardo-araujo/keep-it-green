import { updateLastSyncDate, SyncProfile } from "./configManager";
import { emptyCommit, fetchCommits, pushCommits } from "./gitClient";

export async function runSync(syncProfile: SyncProfile, lastSyncDate: string) {
    try {
        await updateLastSyncDate();

        for (const repo of syncProfile.sourceRepoPaths) {
            const commits = await fetchCommits(repo, syncProfile.authorEmail, lastSyncDate); 

            for (const commit of commits) {
                await emptyCommit(syncProfile.destinationRepoPath, commit.message, commit.date);
            }

            await pushCommits(repo);
        }
    } catch (error) {
        console.log("Sync error: ", error);
        throw(error);
    }
}
