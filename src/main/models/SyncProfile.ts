export interface SyncProfile {
    authorEmail: string;
    destinationRepoPath: string;
    sourceRepoPaths: string[];
    lastSyncDate: string;
    syncInterval: string;
    repoPrivacies: Record<string, boolean>;
}

export function createEmptySyncProfile(): SyncProfile {
    return {
        authorEmail: "",
        destinationRepoPath: "",
        sourceRepoPaths: [],
        lastSyncDate: "",
        syncInterval: "",
        repoPrivacies: {}
    };
}
