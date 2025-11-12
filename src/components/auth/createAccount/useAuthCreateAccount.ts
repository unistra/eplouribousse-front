import { computed, ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePasswordValidators } from '@/composables/usePasswordValidators.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useAuthCreateAccount = () => {
    const route = useRoute()
    const router = useRouter()
    const token = route.query.t
    const { t } = useI18n()
    const { passwordMatchingValidator, passwordStrengthValidator } = usePasswordValidators()
    const { notify } = useComposableQuasar()

    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const isPasswordStrongEnough = computed(() => passwordStrengthValidator(password.value))
    const arePasswordsMatching = computed(() => passwordMatchingValidator(password.value, confirmPassword.value))

    const isLoading = ref(false)

    const fetchEmailFromToken = async () => {
        // Token presence is validated on router navigation guard
        try {
            const response = await axiosI.post<{ email: string }>('/users/invite-handshake/', {
                token: token,
            })
            email.value = response.data.email
        } catch {
            notify({
                type: 'negative',
                message: t('auth.createAccount.tokenRejected'),
            })
            await router.push({ name: 'home' })
        }
    }

    const createAccount = async () => {
        if (!isPasswordStrongEnough.value) {
            notify({
                type: 'negative',
                message: t('forms.password.validation.passwordRequirements'),
            })
            return
        }

        if (!arePasswordsMatching.value) {
            notify({
                type: 'negative',
                message: t('forms.password.validation.passwordsDoNotMatch'),
            })
            return
        }

        isLoading.value = true
        try {
            await axiosI.post('/users/create-account/', {
                token: token,
                password: password.value,
                confirmPassword: confirmPassword.value,
            })

            notify({
                type: 'positive',
                message: t('auth.createAccount.accountCreated'),
            })

            isLoading.value = false

            await router.push({ name: 'login' })
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknownRetry'),
            })
        }
    }

    return {
        email,
        password,
        confirmPassword,
        isPasswordStrongEnough,
        arePasswordsMatching,
        fetchEmailFromToken,
        createAccount,
        isLoading,
    }
}
