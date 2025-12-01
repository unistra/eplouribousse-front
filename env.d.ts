/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENV: string
    readonly VITE_BACK_URL: string
    readonly VITE_MATOMO_SERVER: string
    readonly VITE_MATOMO_SITE_ID: string
    readonly VITE_MATOMO_DEBUG: string
    readonly VITE_I18N_LOCALE: string
}

export {}

declare global {
    interface String {
        snakeToCamel(): string
        capitalize(): string
    }
}
