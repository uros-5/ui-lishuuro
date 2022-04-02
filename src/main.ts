import { createApp, markRaw } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import VueCookies from "vue3-cookies";

import App from "./App.vue";

const pinia = createPinia();
pinia.use(({ store }) => {
  store.$router = markRaw(router);
});

createApp(App).use(router).use(pinia).use(VueCookies).mount("#app");
