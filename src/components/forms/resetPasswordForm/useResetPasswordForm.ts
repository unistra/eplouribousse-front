import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import axiosI from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'

export function useResetPasswordForm() {
    const { t } = useI18n()
    const router = useRouter()
    const { notify } = useComposableQuasar()

    const newPassword = ref('')
    const confirmPassword = ref('')
    const isLoading = ref(false)

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
    // ⚠️ WARNING ⚠️ //
    // Backend is actually using zxcvbn as validator
    // This is not actually the case
    // MAKE SURE to change your password with a strong enough one

    const isNewPasswordValid = computed(() => {
        if (!newPassword.value) return true // Don't show error if empty
        return passwordRegex.test(newPassword.value)
    })

    const doPasswordsMatch = computed(() => {
        if (!confirmPassword.value) return true // Don't show error if empty
        return newPassword.value === confirmPassword.value
    })

    const resetPassword = async () => {
        if (!isNewPasswordValid.value) {
            notify({
                type: 'negative',
                message: t('forms.changePassword.passwordRequirements'),
            })
            return
        }

        if (!doPasswordsMatch.value) {
            notify({
                type: 'negative',
                message: t('forms.changePassword.passwordsDoNotMatch'),
            })
            return
        }

        isLoading.value = true

        try {
            await axiosI.patch(
                '/user/reset-password/',
                {
                    newPassword: newPassword.value,
                    confirmPassword: confirmPassword.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('JWT__access__token')}`,
                    },
                },
            )

            notify({
                type: 'positive',
                message: t('forms.changePassword.success'),
            })

            await router.push({ path: '/' })
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 400) {
                notify({
                    type: 'negative',
                    message: t('forms.changePassword.oldPasswordIncorrect'),
                })
            } else {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        } finally {
            newPassword.value = ''
            confirmPassword.value = ''

            isLoading.value = false
        }
    }

    return {
        newPassword,
        confirmPassword,
        isLoading,
        isNewPasswordValid,
        doPasswordsMatch,
        resetPassword,
    }
}
