import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { usePasswordValidators } from '@/composables/usePasswordValidators.ts'
import { useGlobalStore } from '@/stores/globalStore.ts'

export function useResetPasswordForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const router = useRouter()
    const { passwordMatchingValidator, passwordStrengthValidator } = usePasswordValidators()

    const passwordStrength = ref<number>(0)
    const newPassword = ref<string>('')
    const confirmPassword = ref<string>('')
    const token = ref<string | null>('')

    const isPasswordStrongEnough = computed(() => passwordStrengthValidator(newPassword.value))
    const arePasswordsMatching = computed(() => passwordMatchingValidator(newPassword.value, confirmPassword.value))

    const isLoading = ref<boolean>(false)

    const resetPassword = async () => {
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
            await axiosI.patch('/user/reset-password/', {
                token: token.value,
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            })

            const { addNotify } = useGlobalStore()

            addNotify({
                type: 'positive',
                message: t('forms.password.reset.success'),
            })

            await router.push({ name: 'Home' })
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 400) {
                notify({
                    type: 'negative',
                    message: t('forms.password.reset.tokenRejected'),
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
        isPasswordStrongEnough,
        arePasswordsMatching,
        isLoading,
        resetPassword,
    }
}
