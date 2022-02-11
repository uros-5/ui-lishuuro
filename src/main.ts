import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import VueCookies from 'vue3-cookies'

import App from './App.vue'

createApp(App).use(router).use(createPinia()).use(VueCookies).mount('#app')
