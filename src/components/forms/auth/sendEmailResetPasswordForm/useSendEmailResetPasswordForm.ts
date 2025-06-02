import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useI18n } from 'vue-i18n'

export function useSendEmailResetPasswordForm() {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const email = ref<string>('')
    const isLoading = ref<boolean>(false)

    async function sendEmail() {
        isLoading.value = true
        try {
            await axiosI.post('/users/send-reset-email/', {
                email: email.value,
            })
            notify({
                type: 'positive',
                message: t('forms.password.reset.emailSent', { email: email.value }),
            })
        } catch {
            notify({
                type: 'negative',
                message: t('forms.password.reset.emailNotSent'),
            })
        }
        isLoading.value = false
    }

    return {
        email,
        isLoading,
        sendEmail,
    }
}
