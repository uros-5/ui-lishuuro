import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  assetsInclude: ["**/*.ogg"],

  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => CUSTOM_ELEMENTS.includes(tag),
        },
      },
    }),
  ],
  optimizeDeps: { exclude: ["shuuro-wasm"] },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

const CUSTOM_ELEMENTS = [
  "info-date",
  "selection",
  "square",
  "piece",
  "cg-board",
  "cg-container",
  "piece",
  "i-side.online",
  "player-title",
  "rating",
  "player",
  "round-player0",
  "san",
  "eval",
  "i-side.online",
  "variant-name",
  "i-side",
  "icon",
  "vs-swords",
  "back",
];
