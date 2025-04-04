import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// @ts-ignore: No types for this package
import VueMatomo from 'vue-matomo'

const app = createApp(App)

if (import.meta.env.VITE_ENV !== 'prod') {
    app.use(VueMatomo, {
        router,
        host: import.meta.env.VITE_MATOMO_SERVER,
        siteId: import.meta.env.VITE_MATOMO_SITE_ID,
        debug: import.meta.env.VITE_MATOMO_DEBUG || false,
    })
}

app.use(createPinia())
app.use(router)

app.mount('#app')
