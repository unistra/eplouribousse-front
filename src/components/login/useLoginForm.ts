import { ref } from 'vue'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useAuthentication } from '@/composables/useAuthentication'
import { useI18n } from 'vue-i18n'

export function useLoginForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { login } = useAuthentication()
    const router = useRouter()

    const email = ref<string>('')
    const password = ref<string>('')
    const isLoading = ref<boolean>(false)
    const icon = ref<string>('mdi-eye-off-outline')
    const passwordVisibility = ref<'text' | 'password'>('password')
    const passwordVisibilityLabel = ref<'showPassword' | 'hidePassword'>('showPassword')

    function updatePasswordVisibility() {
        if (passwordVisibility.value === 'text') {
            passwordVisibility.value = 'password'
            passwordVisibilityLabel.value = 'showPassword'
            icon.value = 'mdi-eye-off-outline'
        } else {
            passwordVisibility.value = 'text'
            passwordVisibilityLabel.value = 'hidePassword'
            icon.value = 'mdi-eye-outline'
        }
    }

    async function onLogin() {
        isLoading.value = true
        try {
            await login(email.value, password.value)

            const route = router.currentRoute.value
            const redirectPath = route.query.redirect ? (route.query.redirect as string) : { name: 'Home' }
            await router.push(redirectPath)
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
        icon,
        passwordVisibility,
        passwordVisibilityLabel,
        updatePasswordVisibility,
        onLogin,
    }
}
