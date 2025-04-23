import { createI18n, type I18n } from 'vue-i18n'
import fr from '../../src/locales/fr.json'

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
