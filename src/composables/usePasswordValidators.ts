import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import { dictionary } from '@zxcvbn-ts/language-common'

export const usePasswordValidators = () => {
    const MINIMUM_PASSWORD_STRENGTH = 3

    const passwordMatchingValidator = (newPassword: string, confirmPassword: string) => {
        if (!confirmPassword) return true // Don't show error if empty
        return newPassword === confirmPassword
    }

    const getPasswordStrength = (password: string) => {
        zxcvbnOptions.setOptions({
            dictionary: {
                ...dictionary,
            },
        })
        return zxcvbn(password).score as number
    }

    const passwordStrengthValidator = (password: string) => getPasswordStrength(password) >= MINIMUM_PASSWORD_STRENGTH

    return {
        passwordMatchingValidator,
        passwordStrengthValidator,
        getPasswordStrength,
    }
}
