import { SyncProfile } from "../main/models/SyncProfile";

import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
    getSyncProfile: () => ipcRenderer.invoke("getSyncProfile"),
    saveSyncProfile: (profile: SyncProfile) => ipcRenderer.invoke("saveSyncProfile", profile),
    selectDirectory: () => ipcRenderer.invoke("selectDirectory")
};

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", electronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
