import { getSyncProfile } from "../configManager";
import { runSync } from "../syncService";

let syncTimer: NodeJS.Timeout | null = null;

export function startSyncJob(intervalInMs: number): void {
    if (syncTimer !== null) clearInterval(syncTimer);

    syncTimer = setInterval(async () => {
        console.log("Starting synchronization...");

        try {
            const profile = getSyncProfile();
            await runSync(profile); 

            console.log("Synchronization completed successfully!");
        } catch (error) {
            console.log("Failed to run synchronization job: ", error);
            throw(error);
        }
    }, intervalInMs);

    console.log(`Timer started to run the syncronization at ${intervalInMs}`);
}
