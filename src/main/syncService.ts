import { getSyncProfile, getLastSyncDate, updateLastSyncDate } from "./configManager";
import { emptyCommit, fetchCommits, pushCommits } from "./gitClient";

export async function runSync() {
    try {
        const syncProfile = getSyncProfile();
        const lastSyncDate = getLastSyncDate();

        await updateLastSyncDate();

        for (const repo of syncProfile.sourceRepoPaths) {
            const commits = await fetchCommits(repo, syncProfile.authorEmail, lastSyncDate); 

            for (const commit of commits) {
                await emptyCommit(repo, commit.message, commit.date);
            }

            await pushCommits(repo);
        }
    } catch (error) {
        console.log("Sync error: ", error);
        throw(error);
    }
}
