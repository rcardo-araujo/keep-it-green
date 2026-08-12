import { defaultSyncHistory, SyncHistory } from "./schemas";
import { SYNC_HISTORY_DB_PATH } from "../utils/paths";
import { DatabaseError } from "../errors/DatabaseError";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

let SyncHistoryDb: Low<SyncHistory> | null = null;

export async function initSyncHistoryDb() {
    const adapter = new JSONFile<SyncHistory>(SYNC_HISTORY_DB_PATH);
    SyncHistoryDb = new Low<SyncHistory>(adapter, defaultSyncHistory);

    try {
        await SyncHistoryDb.read();
    } catch (error) {
        throw new DatabaseError("initSyncHistoryDb (read)", { error });
    }
}

export const SyncHistoryRepository = {
    getHistory: () => {
        if (!SyncHistoryDb)
            throw new DatabaseError("getHistory", { reason: "Database not initialized" });

        return structuredClone(SyncHistoryDb.data);
    },

    recordSyncRun: async (commitsCount: number) => {
        if (!SyncHistoryDb) 
            throw new DatabaseError("recordSyncRun", { reason: "Database not initialized" });

        SyncHistoryDb.data.commitsSynced += commitsCount;
        SyncHistoryDb.data.lastSyncDate = new Date().toISOString();

        try {
            await SyncHistoryDb.write();
        } catch (error) {
            throw new DatabaseError("recordSyncRun (write)", { error });
        }
    }
};
