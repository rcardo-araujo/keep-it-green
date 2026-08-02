import { createEmptySyncProfile, SyncProfile } from "./models/SyncProfile";

import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

const userDataPath = app.isPackaged
    ? app.getPath("userData")
    : app.getAppPath();

const syncProfileFilePath = path.join(userDataPath, "sync_profile.json");
const lastSyncFilePath = path.join(userDataPath, "last_sync.txt");

export function initializeUserData(): void {
    if (!fs.existsSync(syncProfileFilePath)) {
        const defaultSyncProfile = createEmptySyncProfile();

        fs.writeFileSync(syncProfileFilePath, JSON.stringify(defaultSyncProfile, null, 4), "utf-8");

        console.log("Sync profile file created");
    }
}

export function getSyncProfile(): SyncProfile {
    const syncProfile = fs.readFileSync(syncProfileFilePath, "utf-8");

    return JSON.parse(syncProfile);
}

export async function saveSyncProfile(profile: SyncProfile): Promise<void> {
    const syncProfilePayload = JSON.stringify(profile, null, 4);

    try {
        await fs.promises.writeFile(syncProfileFilePath, syncProfilePayload, "utf-8");
    } catch (error) {
        console.log("Saving sync profile error: ", error);
        throw(error);
    }
}

export function getLastSyncDate(): string {
    return fs.readFileSync(lastSyncFilePath, "utf-8");
}

export function updateLastSyncDate(): void {
    const newTimestamp = new Date().toISOString();
    fs.writeFileSync(lastSyncFilePath, newTimestamp, "utf-8");
}
