import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import ViteRsw from "vite-plugin-rsw";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => CUSTOM_ELEMENTS.includes(tag),
        },
      },
    }),
    //ViteRsw(),

    /*ViteRsw({
		crates: [{name: "shuuro-wasm", unwatch: [ '../src/**' ],}],
	}),*/
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: { exclude: ["shuuro-wasm"] },
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
