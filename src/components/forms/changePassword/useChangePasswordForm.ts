import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { usePasswordValidators } from '@/composables/usePasswordValidators.ts'

export function useChangePasswordForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const router = useRouter()
    const { passwordMatchingValidator, passwordStrengthValidator } = usePasswordValidators()

    const isLoading = ref(false)

    const oldPassword = ref<string>('')
    const newPassword = ref<string>('')
    const confirmPassword = ref<string>('')
    const isPasswordStrongEnough = computed(() => passwordStrengthValidator(newPassword.value))
    const arePasswordsMatching = computed(() => passwordMatchingValidator(newPassword.value, confirmPassword.value))

    const changePassword = async () => {
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
            await axiosI.patch('/user/change-password/', {
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            })

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
        confirmPassword,
        isLoading,
        changePassword,
        isPasswordStrongEnough,
        arePasswordsMatching,
    }
}
