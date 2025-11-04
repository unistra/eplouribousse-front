import { ref } from 'vue'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { AxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth.ts'

export function useAuthLogin() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { login } = useAuth()

    const email = ref<string>('')
    const password = ref<string>('')
    const isLoading = ref<boolean>(false)
    const saml2URL = ref<string>('')

    const onLogin = async () => {
        isLoading.value = true

        try {
            await login(email.value, password.value)
        } catch (e) {
            password.value = ''

            if (e instanceof AxiosError && e.response?.status === 401) {
                notify({
                    type: 'negative',
                    message: t('forms.login.credentialsError'),
                })
            } else {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        } finally {
            isLoading.value = false
        }
    }

    return {
        email,
        password,
        isLoading,
        onLogin,
        saml2URL,
    }
}
