import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import axiosI from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'

export function useResetPasswordForm() {
    const { t } = useI18n()
    const router = useRouter()
    const { notify } = useComposableQuasar()

    const newPassword = ref('')
    const confirmPassword = ref('')
    const isLoading = ref(false)

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/

    const isNewPasswordValid = computed(() => {
        if (!newPassword.value) return true
        return passwordRegex.test(newPassword.value)
    })

    const doPasswordsMatch = computed(() => {
        if (!confirmPassword.value) return true
        return newPassword.value === confirmPassword.value
    })

    const resetPassword = async () => {
        if (!isNewPasswordValid.value) {
            notify({
                type: 'negative',
                message: t('forms.resetPassword.passwordRequirements'),
            })
            return
        }

        if (!doPasswordsMatch.value) {
            notify({
                type: 'negative',
                message: t('forms.resetPassword.passwordsDoNotMatch'),
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
                message: t('forms.resetPassword.success'),
            })

            await router.push({ path: '/' })
        } catch (_e) {
            console.error(_e)
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
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
