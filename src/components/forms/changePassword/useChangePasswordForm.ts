import { useI18n } from 'vue-i18n'
import { ref, computed, watch } from 'vue'
import { axiosI } from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useFormUtils } from '@/composables/useFormUtils'

export function useChangePasswordForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { getPasswordStrength } = useFormUtils()
    const router = useRouter()

    const passwordStrength = ref<number>(0)
    const oldPassword = ref<string>('')
    const newPassword = ref<string>('')
    const confirmPassword = ref<string>('')
    const isLoading = ref(false)
    const isNewPasswordValid = ref<boolean>(false)

    watch(newPassword, () => {
        passwordStrength.value = getPasswordStrength(newPassword.value)
        isNewPasswordValid.value = passwordStrength.value >= 3
    })

    const doPasswordsMatch = computed(() => {
        if (!confirmPassword.value) return true // Don't show error if empty
        return newPassword.value === confirmPassword.value
    })

    const changePassword = async () => {
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
                '/api/user/change-password/',
                {
                    oldPassword: oldPassword.value,
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
                message: t('forms.password.change.success'),
            })

            await router.push({ path: '/' })
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 400) {
                notify({
                    type: 'negative',
                    message: t('forms.password.oldPasswordIncorrect'),
                })
            } else {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        } finally {
            oldPassword.value = ''
            newPassword.value = ''
            confirmPassword.value = ''

            isLoading.value = false
        }
    }

    return {
        oldPassword,
        newPassword,
        passwordStrength,
        confirmPassword,
        isLoading,
        isNewPasswordValid,
        doPasswordsMatch,
        changePassword,
    }
}
