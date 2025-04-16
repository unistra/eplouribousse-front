/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENV: string
    readonly VITE_MATOMO_SERVER: string
    readonly VITE_MATOMO_SITE_ID: string
    readonly VITE_MATOMO_DEBUG: string
    readonly VITE_I18N_LOCALE: string
    readonly VITE_APP_BASE_URL: string
}
