import { SyncProfile, createEmptySyncProfile } from "../models/SyncProfile";
import { SYNC_PROFILE_PATH } from "../utils/paths";

import * as fs from "fs";

export function initializeUserData(): void {
    if (!fs.existsSync(SYNC_PROFILE_PATH)) {
        const defaultSyncProfile = createEmptySyncProfile();

        fs.writeFileSync(SYNC_PROFILE_PATH, JSON.stringify(defaultSyncProfile, null, 4), "utf-8");

        console.log("Sync profile file created");
    }
}

export function getSyncProfile(): SyncProfile | null {
    if (!fs.existsSync(SYNC_PROFILE_PATH)) return null;

    try {
        const syncProfile = fs.readFileSync(SYNC_PROFILE_PATH, "utf-8");

        return JSON.parse(syncProfile);
    } catch (error) {
        console.log("Sync profile JSON is corrupted: ", error);
        return null;
    }
}

export async function saveSyncProfile(profile: SyncProfile): Promise<void> {
    const syncProfilePayload = JSON.stringify(profile, null, 4);

    try {
        await fs.promises.writeFile(SYNC_PROFILE_PATH, syncProfilePayload, "utf-8");
    } catch (error) {
        console.log("Saving sync profile error: ", error);
        throw(error);
    }
}

