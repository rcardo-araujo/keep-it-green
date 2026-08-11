import { defaultSyncHistory, SyncHistory } from "./schemas";
import { METRICS_DB_PATH } from "../utils/paths";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

let SyncHistoryDb: Low<SyncHistory> | null = null;

export async function initSyncHistoryDb() {
    const adapter = new JSONFile<SyncHistory>(METRICS_DB_PATH);
    SyncHistoryDb = new Low<SyncHistory>(adapter, defaultSyncHistory);

    await SyncHistoryDb.read();
}

export const SyncHistoryRepository = {
    getHistory: () => {
        if (!SyncHistoryDb) throw new Error("Sync History database not initialized");

        return structuredClone(SyncHistoryDb.data);
    },

    incrementCommitsSynced: async (count: number) => {
        if (!SyncHistoryDb) throw new Error("Sync History database not initialized");

        SyncHistoryDb.data.commitsSynced += count;

        try {
            await SyncHistoryDb.write();
        } catch (error) {
            console.error("Failed to save Sync History database: ", error);
            throw(error);
        }
    }
};
