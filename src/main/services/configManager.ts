import { SyncProfile, createEmptySyncProfile } from "../models/SyncProfile";
import { SYNC_PROFILE_PATH } from "../utils/paths";
import { ConfigError } from "../errors/ConfigError";

import * as fs from "fs";

export function initializeUserData(): void {
    if (!fs.existsSync(SYNC_PROFILE_PATH)) {
        const defaultSyncProfile = createEmptySyncProfile();

        try {
            fs.writeFileSync(SYNC_PROFILE_PATH, JSON.stringify(defaultSyncProfile, null, 4), "utf-8");

            console.info("[INFO] Sync profile file created");
        } catch (error) {
            throw new ConfigError("initializeUserData", { error });
        }
    }
}

export function getSyncProfile(): SyncProfile | null {
    if (!fs.existsSync(SYNC_PROFILE_PATH)) return null;

    try {
        const syncProfile = fs.readFileSync(SYNC_PROFILE_PATH, "utf-8");

        return JSON.parse(syncProfile);
    } catch (error) {
        throw new ConfigError("getSyncProfile", { error, reason: "Sync profile JSON is corrupted" });
    }
}

export async function saveSyncProfile(profile: SyncProfile): Promise<void> {
    const syncProfilePayload = JSON.stringify(profile, null, 4);

    try {
        await fs.promises.writeFile(SYNC_PROFILE_PATH, syncProfilePayload, "utf-8");
    } catch (error) {
        throw new ConfigError("saveSyncProfile", { error });
    }
}

