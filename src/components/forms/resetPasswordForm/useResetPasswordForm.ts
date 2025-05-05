import { useI18n } from 'vue-i18n'
import { ref, computed, watch } from 'vue'
import axiosI from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useFormUtils } from '@/composables/useFormUtils'

export function useResetPasswordForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { getPasswordStrength } = useFormUtils()
    const router = useRouter()

    const passwordStrength = ref<number>(0)
    const newPassword = ref<string>('')
    const confirmPassword = ref<string>('')
    const token = ref<string | null>('')
    const isLoading = ref(false)
    const isNewPasswordValid = ref<boolean>(false)

    watch(newPassword, () => {
        passwordStrength.value = getPasswordStrength(newPassword.value)
        isNewPasswordValid.value = passwordStrength.value >= 3
    })

    const doPasswordsMatch = computed(() => {
        if (!confirmPassword.value) return true
        return newPassword.value === confirmPassword.value
    })

    const resetPassword = async () => {
        if (!isNewPasswordValid.value) {
            notify({
                type: 'negative',
                message: t('forms.password.passwordRequirements'),
            })
            return
        }

        if (!doPasswordsMatch.value) {
            notify({
                type: 'negative',
                message: t('forms.password.passwordsDoNotMatch'),
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

            notify({
                type: 'positive',
                message: t('forms.password.reset.success'),
            })

            await router.push({ name: 'Login' })
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 400 && e.response.data.token.length > 0) {
                console.log(e.response.data)
                notify({
                    type: 'negative',
                    message: e.response.data.token[0],
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
        isLoading,
        isNewPasswordValid,
        doPasswordsMatch,
        resetPassword,
    }
}
