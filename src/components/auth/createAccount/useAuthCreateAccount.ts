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

    const fetchEmailLoading = ref<boolean>(false)
    const email = ref<string>('')
    const firstName = ref<string>('')
    const lastName = ref<string>('')

    const fetchEmailFromToken = async () => {
        // Token presence is validated on router navigation guard
        try {
            fetchEmailLoading.value = true
            const response = await axiosI.post<{ email: string }>('/users/invite-handshake/', {
                token: token,
            })
            email.value = response.data.email
        } catch {
            notify({
                type: 'negative',
                message: t('errors.auth.tokenRejected'),
            })
            await router.push({ name: 'home' })
        } finally {
            fetchEmailLoading.value = false
        }
    }

    const buttonSubmitLoading = ref(false)
    const password = ref('')
    const confirmPassword = ref('')
    const isPasswordStrongEnough = computed(() => passwordStrengthValidator(password.value))
    const arePasswordsMatching = computed(() => passwordMatchingValidator(password.value, confirmPassword.value))

    const isFirstNameValid = computed(() => firstName.value.trim().length >= 2)
    const isLastNameValid = computed(() => lastName.value.trim().length >= 2)

    const createAccount = async () => {
        try {
            buttonSubmitLoading.value = true
            await axiosI.post('/users/create-account/', {
                token: token,
                firstName: firstName.value,
                lastName: lastName.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
            })

            notify({
                type: 'positive',
                message: t('successes.auth.accountCreated'),
            })
            await router.push({ name: 'login' })
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknownRetry'),
            })
        } finally {
            buttonSubmitLoading.value = false
        }
    }

    return {
        fetchEmailLoading,
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        isPasswordStrongEnough,
        arePasswordsMatching,
        isFirstNameValid,
        isLastNameValid,
        fetchEmailFromToken,
        createAccount,
        buttonSubmitLoading,
    }
}
