export interface DashboardStats {
    commitsSynced: number;
    sourceReposCount: number;
    lastSyncDate: string;
    nextSyncDate: string;
}

export function createEmptyDashboardStats(): DashboardStats {
    return {
        commitsSynced: 0,
        sourceReposCount: 0,
        lastSyncDate: "",
        nextSyncDate: ""
    };
}
