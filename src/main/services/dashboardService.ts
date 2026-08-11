import { getSyncProfile } from "./configManager";
import { SyncHistoryRepository } from "../databases/db";
import { createEmptyDashboardStats, DashboardStats } from "../models/DashboardStats";

export async function getDashboardStats(): Promise<DashboardStats> {
    const stats = createEmptyDashboardStats();

    const history = SyncHistoryRepository.getHistory();
    if (history) {
        stats.commitsSynced = history.commitsSynced;
        stats.lastSyncDate = history.lastSyncDate || "";
    }

    const profile = getSyncProfile();
    if (profile) stats.sourceReposCount = profile.sourceRepoPaths.length;

    return stats;
}
