import './assets/main.css'
import '@/utils/string'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

// @ts-ignore: No types for this package
import VueMatomo from 'vue-matomo'
import type { MatomoConfigType } from '../env'
import MatomoConfigJson from '../matomo.config.json'

import * as Sentry from '@sentry/vue'

// Import Quasar plugins
import { Loading, Notify, Quasar } from 'quasar'
import quasarLang from 'quasar/lang/fr'
import quasarIconSet from 'quasar/icon-set/mdi-v7'

// Import icon libraries
import '@quasar/extras/mdi-v7/mdi-v7.css'

const app = createApp(App)

// MATOMO =============
const MatomoConfig = MatomoConfigJson as unknown as MatomoConfigType
const tenantSubdomain = location.hostname.match(/^([^.]+)\.eplouribousse\.fr$/)?.[1]

if (import.meta.env.VITE_ENV === 'prod' && tenantSubdomain && MatomoConfig[tenantSubdomain]) {
    app.use(VueMatomo, {
        router,
        host: MatomoConfig[tenantSubdomain].server,
        siteId: MatomoConfig[tenantSubdomain].id,
        debug: MatomoConfig[tenantSubdomain].debug || false,
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

app.use(Quasar, {
    plugins: {
        Notify,
        Loading,
    },
    lang: quasarLang,
    iconSet: quasarIconSet,
    /*
  config: {
    brand: {
      // primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }
  */
})
app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
