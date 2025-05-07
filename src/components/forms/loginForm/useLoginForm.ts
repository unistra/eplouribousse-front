import { ref } from 'vue'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRoute, useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useAuthentication } from '@/composables/useAuthentication'
import { useI18n } from 'vue-i18n'
import { axiosAuth } from '@/plugins/axios'

export function useLoginForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { login } = useAuthentication()
    const router = useRouter()
    const route = useRoute()

    const email = ref<string>('')
    const password = ref<string>('')
    const isLoading = ref<boolean>(false)

    async function shibb() {
        isLoading.value = true
        try {
            await axiosAuth.get('/saml2/login/')
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

    const onLogin = async () => {
        isLoading.value = true

        try {
            await login(email.value, password.value)
            notify({
                type: 'positive',
                message: t('forms.login.success'),
            })
            await router.push((route.query.redirect as string | undefined) ?? { name: 'Home' })
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
        shibb,
    }
}
