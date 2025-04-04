import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// @ts-ignore: No types for this package
import VueMatomo from 'vue-matomo'

import * as Sentry from '@sentry/vue'

const app = createApp(App)

if (import.meta.env.VITE_ENV !== 'prod') {
    app.use(VueMatomo, {
        router,
        host: import.meta.env.VITE_MATOMO_SERVER,
        siteId: import.meta.env.VITE_MATOMO_SITE_ID,
        debug: import.meta.env.VITE_MATOMO_DEBUG || false,
    })
}

if (import.meta.env.MODE !== 'development') {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for tracing.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    })
}

app.use(createPinia())
app.use(router)

app.mount('#app')
