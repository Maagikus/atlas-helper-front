import { fileURLToPath, URL } from "node:url"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3002,
    },
    plugins: [vue(), nodePolyfills(), vueDevTools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    envPrefix: "VITE_",
})
