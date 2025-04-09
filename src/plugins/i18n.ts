import { createI18n } from 'vue-i18n'
import fr from '@/locales/fr.json'

const appLocale = import.meta.env.VITE_I18N_LOCALE

export default createI18n({
    legacy: false,
    locale: appLocale,
    fallbackLocale: appLocale,
    messages: {
        fr,
    },
})
