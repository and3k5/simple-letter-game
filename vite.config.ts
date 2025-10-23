/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
    plugins: [vue()],
    base: "",
    resolve: {
        alias: [
            {
                find: "@",
                replacement: resolve(__dirname, "src"),
            },
        ],
    },
    test: {
        exclude: [],
        browser: {
            provider: playwright(),
            enabled: true,
            instances: [{ browser: "chromium" }],
        },
    },
});
