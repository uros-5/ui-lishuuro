import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    experimental: {
      wasm: true
    }
  },

  vite: {
    optimizeDeps: { exclude: ["shuuro-wasm"] },
    assetsInclude: ["**/*.ogg"],
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => CUSTOM_ELEMENTS.includes(tag),
    }
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1"
    },
    pageTransition: { name: 'list', mode: 'in-out' }
  },

  modules: [
    "@pinia/nuxt"
  ],

  routeRules: {
    'index': { ssr: false }
  },

  css: ['~/assets/css/main.css'],

  imports: {
    dirs: [
      "stores/**"
    ]
  },

  alias: {
    "@": fileURLToPath(new URL(".", import.meta.url)),
    "assets": fileURLToPath(new URL("./assets", import.meta.url)),
    "stores": fileURLToPath(new URL("./stores", import.meta.url)),
    "utils": fileURLToPath(new URL("./utils", import.meta.url)),
    "public": fileURLToPath(new URL("./public", import.meta.url))
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  devtools: {
    enabled: false
  }
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
  "mini-game",
  "vari",
  "vari-move",
];
