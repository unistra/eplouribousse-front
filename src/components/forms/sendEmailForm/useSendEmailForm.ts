import { useComposableQuasar } from '@/composables/useComposableQuasar'
import { ref } from 'vue'
import axiosI from '@/plugins/axios.ts'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'

export function useSendEmailForm() {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const email = ref<string>('')
    const isLoading = ref<boolean>(false)

    async function sendEmail() {
        isLoading.value = true
        try {
            await axiosI.patch('/user/send-reset-email/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('JWT__access__token')}`,
                },
            })
        } catch (e) {
            email.value = ''
            if (e instanceof AxiosError && e.response?.status === 400) {
                notify({
                    type: 'negative',
                    message: t('forms.resetPassword.incorrectEmail'),
                })
            } else {
                notify({
                    type: 'negative',
                    message: t('forms.resetPassword.emailNotSent'),
                })
            }
        } finally {
            isLoading.value = false
            notify({
                type: 'positive',
                message: t('forms.resetPassword.emailSent'),
            })
        }
    }

    return {
        email,
        isLoading,
        sendEmail,
    }
}
