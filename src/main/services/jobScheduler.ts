import { getSyncProfile } from "./configManager";
import { runSync } from "./syncService";

let syncTimer: NodeJS.Timeout | null = null;

export function startSyncJob(intervalInMs: number): void {
    if (syncTimer !== null) clearInterval(syncTimer);

    syncTimer = setInterval(async () => {
        console.info("[INFO] Starting scheduled synchronization...");

        try {
            const profile = getSyncProfile();

            if (profile) {
                await runSync(profile); 

                console.info("[INFO] Synchronization completed successfully!");
            } 
        } catch (error) {
            console.error("[ERROR] Failed to run synchronization job: ", error);
        }
    }, intervalInMs);

    console.info(`[INFO] Timer started to run the synchronization at ${intervalInMs}ms`);
}

export function stopSyncJob(): void {
    if (syncTimer !== null) {
        clearInterval(syncTimer);
        syncTimer = null;
    }
}
