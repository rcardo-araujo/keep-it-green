export interface SyncProfile {
    authorEmail: string,
    destinationRepoPath: string,
    sourceRepoPaths: string[],
    lastSyncDate: string,
    syncInterval: string
};
