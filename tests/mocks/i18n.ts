import fr from '@/locales/fr.json'
import { createI18n, type I18n } from 'vue-i18n'

export default function useI18nMock() {
    const i18nMock: I18n = createI18n({
        legacy: false,
        locale: 'fr',
        fallbackLocale: 'fr',
        messages: { fr },
    })

    return {
        i18nMock,
    }
}
