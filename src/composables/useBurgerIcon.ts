import { useStore } from "@/store";
import { createApp } from "vue";
import App from "@/App.vue";
import { createPinia } from "pinia";
const pinia = createPinia();
const app = await createApp(App);
app.use(pinia);

const store = useStore();

export default () => {
  function toggle(): void {
    store.toggle();
  }

  function navVisible(): boolean {
    return store.$state.navVisible;
  }

  return { toggle, navVisible };
};
