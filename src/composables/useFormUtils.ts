import { ref } from 'vue'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'

export function useFormUtils() {
    const icon = ref<string>('mdi-eye-off-outline')
    const passwordVisibility = ref<'text' | 'password'>('password')
    const passwordVisibilityLabel = ref<'showPassword' | 'hidePassword'>('showPassword')
    const options = {
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
        },
    }

    const getPasswordStrength = (password: string) => {
        zxcvbnOptions.setOptions(options)
        return zxcvbn(password).score as number
    }

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
        getPasswordStrength,
        updatePasswordVisibility,
    }
}
