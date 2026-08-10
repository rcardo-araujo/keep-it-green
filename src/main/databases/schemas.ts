export interface SyncHistory {
    commitsSynced: number;
    lastSyncDate: string | null;
}

export const defaultSyncHistory: SyncHistory = {
    commitsSynced: 0,
    lastSyncDate: null
};
