import { describe, expect, test, vi, beforeEach } from 'vitest'
import { usePasswordField } from '../usePasswordField'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: vi.fn((key) => key),
    }),
}))

describe('usePasswordField', () => {
    let passwordFieldComposable: ReturnType<typeof usePasswordField>

    beforeEach(() => {
        passwordFieldComposable = usePasswordField()
    })

    test('returns default values when initialized', () => {
        expect(passwordFieldComposable.defaultLabel).toBe('forms.login.password')
        expect(passwordFieldComposable.isPasswordVisible.value).toBe(false)
        expect(passwordFieldComposable.passwordStrength.value).toBe(0)
        expect(passwordFieldComposable.isInputFocused.value).toBe(false)
    })

    test('icon returns correct value based on password visibility', () => {
        expect(passwordFieldComposable.icon.value).toBe('mdi-eye-outline')

        passwordFieldComposable.isPasswordVisible.value = true
        expect(passwordFieldComposable.icon.value).toBe('mdi-eye-off-outline')

        passwordFieldComposable.isPasswordVisible.value = false
        expect(passwordFieldComposable.icon.value).toBe('mdi-eye-outline')
    })

    test('passwordVisibilityLabel returns correct label based on visibility state', () => {
        expect(passwordFieldComposable.passwordVisibilityLabel.value).toBe('forms.password.isVisibleTooltip.false')

        passwordFieldComposable.isPasswordVisible.value = true
        expect(passwordFieldComposable.passwordVisibilityLabel.value).toBe('forms.password.isVisibleTooltip.true')
    })
})
