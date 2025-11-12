import { useI18n } from 'vue-i18n'

export const useUtils = () => {
    const { locale } = useI18n()

    const useIntlDateTimeFormat = (date: string) =>
        new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date))

    return {
        useIntlDateTimeFormat,
    }
}
