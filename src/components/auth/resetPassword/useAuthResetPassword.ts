import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { usePasswordValidators } from '@/composables/usePasswordValidators.ts'

export function useAuthResetPassword() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const router = useRouter()
    const { passwordMatchingValidator, passwordStrengthValidator } = usePasswordValidators()

    const passwordStrength = ref<number>(0)
    const newPassword = ref<string>('')
    const confirmPassword = ref<string>('')
    const token = ref<string | null>('')
    const uidb64 = ref<string | null>('')

    const isPasswordStrongEnough = computed(() => passwordStrengthValidator(newPassword.value))
    const arePasswordsMatching = computed(() => passwordMatchingValidator(newPassword.value, confirmPassword.value))

    const isLoading = ref<boolean>(false)

    const resetPassword = async () => {
        if (!isPasswordStrongEnough.value) {
            notify({
                type: 'negative',
                message: t('errors.form.password.requirements'),
            })
            return
        }

        if (!arePasswordsMatching.value) {
            notify({
                type: 'negative',
                message: t('errors.form.password.doesNotMatch'),
            })
            return
        }

        isLoading.value = true

        try {
            await axiosI.patch('/users/reset-password/', {
                token: token.value,
                uidb64: uidb64.value,
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            })

            notify({
                type: 'positive',
                message: t('successes.auth.password.reset'),
            })

            await router.push({ name: 'home' })
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 400) {
                notify({
                    type: 'negative',
                    message: t('errors.auth.tokenRejected'),
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
        newPassword,
        confirmPassword,
        passwordStrength,
        token,
        uidb64,
        isPasswordStrongEnough,
        arePasswordsMatching,
        isLoading,
        resetPassword,
    }
}
