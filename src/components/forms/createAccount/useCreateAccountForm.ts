import { computed, ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useI18n } from 'vue-i18n'
import { usePasswordValidators } from '@/composables/usePasswordValidators.ts'
import { AxiosError } from 'axios'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useCreateAccountForm = () => {
    const route = useRoute()
    const router = useRouter()
    const token = route.query.t
    const { addNotify } = useGlobalStore()
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
        if (!token) {
            addNotify({
                type: 'negative',
                message: t('forms.createAccount.missingToken'),
            })
            await router.push({ name: 'Home' })
            return
        }
        try {
            const response = await axiosI.post<{ email: string }>('/users/invite-handshake/', {
                token: token,
            })
            if (response.status === 200 && response.data.email) {
                email.value = response.data.email
            } else {
                addNotify({
                    type: 'negative',
                    message: t('forms.createAccount.fetchEmailFailed'),
                    timeout: 8000,
                })
                await router.push({ name: 'Home' })
            }
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 403) {
                addNotify({
                    type: 'negative',
                    message: `${t('forms.createAccount.tokenRejected')}`,
                    timeout: 8000,
                })
                await router.push({ name: 'Home' })
            } else {
                addNotify({
                    type: 'negative',
                    message: t('errors.unknownRetry'),
                    timeout: 8000,
                })
                await router.push({ name: 'Home' })
            }
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
            await axiosI.post('/user/create-account/', {
                token: token,
                password: password.value,
                confirmPassword: confirmPassword.value,
            })

            addNotify({
                type: 'positive',
                message: t('forms.createAccount.accountCreated'),
            })

            isLoading.value = false

            await router.push({ name: 'Home' })
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
