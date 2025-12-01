import { useI18n } from 'vue-i18n'
import { isAxiosError, type AxiosError } from 'axios'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { formatErrorMessage } from '@/utils/string.ts'

export const useUtils = () => {
    const { t, locale } = useI18n()
    const { notify } = useComposableQuasar()

    const useIntlDateTimeFormat = (date: string) =>
        new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date))

    const useHandleError = (error: AxiosError | unknown) => {
        if (!isAxiosError(error)) {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
            console.error(error)
            return
        }

        notify({
            type: 'negative',
            message: error.response?.data ? formatErrorMessage(error.response.data) : t('errors.unknown'),
            timeout: 0,
            actions: [
                {
                    icon: 'mdi-close',
                    size: 'sm',
                    color: 'white',
                    round: true,
                },
            ],
        })
    }

    return {
        useIntlDateTimeFormat,
        useHandleError,
    }
}
