export interface Metrics {
    totalCommits: number;
    lastSyncDate: string | null;
}

export const defaultMetrics: Metrics = {
    totalCommits: 0,
    lastSyncDate: null
};
