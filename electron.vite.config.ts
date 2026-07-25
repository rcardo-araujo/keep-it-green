import { resolve } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    main: {},
    preload: {
        build: {
            rollupOptions: {
                input: resolve(__dirname, "src/bridge/index.ts")
            }
        }
    },
    renderer: {
        root: "src/ui",
        build: {
            rollupOptions: {
                input: resolve(__dirname, "src/ui/index.")
            }
        },
        resolve: {
            alias: {
                "@ui": resolve("src/ui/src")
            }
        },
        plugins: [react()]
    }
});
