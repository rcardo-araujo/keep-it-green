import { app } from "electron";
import * as path from "path";

export const USER_DATA_PATH = app.isPackaged
    ? app.getPath("userData")
    : app.getAppPath();

export const SYNC_PROFILE_PATH = path.join(USER_DATA_PATH, "sync_profile.json");
export const METRICS_DB_PATH = path.join(USER_DATA_PATH, "metrics.json");
