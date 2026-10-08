import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { dictionary } from '@zxcvbn-ts/language-common'

const zxcvbn = new ZxcvbnFactory({ dictionary })

export const usePasswordValidators = () => {
    const MINIMUM_PASSWORD_STRENGTH = 3

    const passwordMatchingValidator = (newPassword: string, confirmPassword: string) => {
        if (!confirmPassword) return true // Don't show error if empty
        return newPassword === confirmPassword
    }

    const getPasswordStrength = (password: string) => zxcvbn.check(password).score

    const passwordStrengthValidator = (password: string) => getPasswordStrength(password) >= MINIMUM_PASSWORD_STRENGTH

    return {
        passwordMatchingValidator,
        passwordStrengthValidator,
        getPasswordStrength,
    }
}
