import { ref } from 'vue'

export function useFormUtils() {
    const icon = ref<string>('mdi-eye-off-outline')
    const passwordVisibility = ref<'text' | 'password'>('password')
    const passwordVisibilityLabel = ref<'showPassword' | 'hidePassword'>('showPassword')

    function updatePasswordVisibility() {
        if (passwordVisibility.value === 'text') {
            passwordVisibility.value = 'password'
            passwordVisibilityLabel.value = 'showPassword'
            icon.value = 'mdi-eye-off-outline'
        } else {
            passwordVisibility.value = 'text'
            passwordVisibilityLabel.value = 'hidePassword'
            icon.value = 'mdi-eye-outline'
        }
    }

    return {
        icon,
        passwordVisibility,
        passwordVisibilityLabel,
        updatePasswordVisibility,
    }
}
