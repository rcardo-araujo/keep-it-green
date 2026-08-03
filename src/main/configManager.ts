import { createEmptySyncProfile, SyncProfile } from "./models/SyncProfile";

import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

const userDataPath = app.isPackaged
    ? app.getPath("userData")
    : app.getAppPath();

const syncProfileFilePath = path.join(userDataPath, "sync_profile.json");

export function initializeUserData(): void {
    if (!fs.existsSync(syncProfileFilePath)) {
        const defaultSyncProfile = createEmptySyncProfile();

        fs.writeFileSync(syncProfileFilePath, JSON.stringify(defaultSyncProfile, null, 4), "utf-8");

        console.log("Sync profile file created");
    }
}

export function getSyncProfile(): SyncProfile | null {
    if (!fs.existsSync(syncProfileFilePath)) return null;

    try {
        const syncProfile = fs.readFileSync(syncProfileFilePath, "utf-8");

        return JSON.parse(syncProfile);
    } catch (error) {
        console.log("Sync profile JSON is corrupted: ", error);
        return null;
    }
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

export async function updateLastSyncDate(): Promise<void> {
    try {
        const syncProfile = await getSyncProfile();
        
        const updatedSyncProfile = {
            ...syncProfile,
            lastSyncDate: new Date().toISOString()
        }

        const updatedSyncProfilePayload = JSON.stringify(updatedSyncProfile, null, 4);
        await fs.promises.writeFile(syncProfileFilePath, updatedSyncProfilePayload, "utf-8");
    } catch(error) {
        console.log("Updating last sync date error: ", error);
        throw(error);
    }
}
