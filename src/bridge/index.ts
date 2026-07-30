import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
    getSyncProfile: () => ipcRenderer.invoke("getSyncProfile"),
    saveSyncProfile: (
        authorEmail: string, 
        destinationRepoPath: string, 
        sourceRepoPaths: string[], 
        lastSyncDate: string,
        syncInterval: string,
        repoPrivacies: Record<string, boolean>
    ) => {
        return ipcRenderer.invoke("saveSyncProfile", authorEmail, destinationRepoPath, sourceRepoPaths, lastSyncDate, syncInterval, repoPrivacies)
    },
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
