import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'

import App from './App.vue'

createApp(App).use(router).use(createPinia()).mount('#app')
