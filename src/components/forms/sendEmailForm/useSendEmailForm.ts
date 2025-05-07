import { useComposableQuasar } from '@/composables/useComposableQuasar'
import { ref } from 'vue'
import { axiosI } from '@/plugins/axios.ts'
import { useI18n } from 'vue-i18n'

export function useSendEmailForm() {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const email = ref<string>('')
    const isLoading = ref<boolean>(false)

    async function sendEmail() {
        console.log('test')
        isLoading.value = true
        try {
            await axiosI.post('/user/send-reset-email/', {
                email: email.value,
            })
        } finally {
            isLoading.value = false
            notify({
                type: 'positive',
                message: t('forms.password.reset.emailSent', { email: email.value }),
            })
        }
    }

    return {
        email,
        isLoading,
        sendEmail,
    }
}
