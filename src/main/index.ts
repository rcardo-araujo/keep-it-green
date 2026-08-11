import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { getSyncProfile, saveSyncProfile } from "./configManager";
import { SyncProfile } from "./models/SyncProfile";
import { startSyncJob } from "./services/jobScheduler";
import { SyncIntervals } from "./registry/SyncIntervals";
import { runSync } from "./syncService";
import { initSyncHistoryDb } from "./databases/db";
import { getDashboardStats } from "./dashboardService";

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: false
        }
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // IPC test
    ipcMain.on("ping", () => console.log("pong"));

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    try {
        await initSyncHistoryDb();
        
        console.log("Sync History database initialized");
    } catch (error) {
        console.error("Error at loading Sync History database: ", error);
        throw(error);
    }

    ipcMain.handle("getSyncProfile", async () => {
        return await getSyncProfile();
    });

    try {
        const profile = getSyncProfile();
        
        if (profile !== null) {
            const interval = SyncIntervals[profile.syncInterval];
            startSyncJob(interval);
        }
    } catch (error) {
        throw(error);
    }

    ipcMain.handle("saveSyncProfile", async (_event, profile: SyncProfile) => {
        await saveSyncProfile(profile);

        const interval = SyncIntervals[profile.syncInterval];
        startSyncJob(interval);
    });

    ipcMain.handle("selectDirectory", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"]
        });

        if (result.canceled) {
            return null;
        }

        return result.filePaths[0];
    });

    ipcMain.handle("sync", async () => {
        try {
            const profile = getSyncProfile();

            if (profile !== null) await runSync(profile);
        } catch (error) {
            throw(error);
        }
    });

    ipcMain.handle("getDashboardStats", async () => {
        try {
            return await getDashboardStats();
        } catch (error) {
            throw(error);
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
