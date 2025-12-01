import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const usePasswordField = () => {
    const { t } = useI18n()

    const defaultLabel = t('common.password')
    const isPasswordVisible = ref<boolean>(false)
    const icon = computed(() => (isPasswordVisible.value ? 'mdi-eye-off-outline' : 'mdi-eye-outline'))
    const passwordVisibilityLabel = computed(
        () => `forms.password.isVisibleTooltip.${isPasswordVisible.value.toString()}`,
    )
    const passwordStrength = ref(0)
    const isInputFocused = ref<boolean>(false)

    return {
        defaultLabel,
        isPasswordVisible,
        icon,
        passwordVisibilityLabel,
        passwordStrength,
        isInputFocused,
    }
}
