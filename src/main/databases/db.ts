import { defaultMetrics, Metrics } from "./schemas";
import { METRICS_DB_PATH } from "../utils/paths";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

let metricsDb: Low<Metrics> | null = null;

export async function initializeMetricsDb() {
    const adapter = new JSONFile<Metrics>(METRICS_DB_PATH);
    metricsDb = new Low<Metrics>(adapter, defaultMetrics);

    await metricsDb.read();
}

export const metricsRepository = {
    getMetrics: () => {
        if (!metricsDb) throw new Error("Metrics database not initialized");

        return structuredClone(metricsDb.data);
    },

    addToTotalCommits: async (quantity: number) => {
        if (!metricsDb) throw new Error("Metrics database not initialized");

        metricsDb.data.totalCommits += quantity;

        try {
            await metricsDb.write();
        } catch (error) {
            console.error("Failed to save Metrics DB: ", error);
            throw(error);
        }
    }
};
