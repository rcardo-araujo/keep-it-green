export interface SyncProfile {
    authorEmail: string;
    destinationRepoPath: string;
    sourceRepoPaths: string[];
    syncInterval: string;
    initialSyncDate: string;
    repoPrivacies: Record<string, boolean>;
}

export function createEmptySyncProfile(): SyncProfile {
    return {
        authorEmail: "",
        destinationRepoPath: "",
        sourceRepoPaths: [],
        syncInterval: "",
        initialSyncDate: "",
        repoPrivacies: {}
    };
}
