import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useResetPasswordForm } from '../useResetPasswordForm'
import { flushPromises } from '@vue/test-utils'
import { AxiosError, type AxiosRequestHeaders } from 'axios'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        routerPush: vi.fn(),
        axiosPatch: vi.fn(),
        t: vi.fn((key) => key),
        passwordValidators: {
            passwordMatchingValidator: vi.fn(),
            passwordStrengthValidator: vi.fn(),
        },
        addNotify: vi.fn(),
    }
})

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: mock.t,
    }),
}))

vi.mock('@/composables/useComposableQuasar.ts', () => ({
    useComposableQuasar: () => ({
        notify: mock.notify,
    }),
}))

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mock.routerPush,
    }),
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        patch: mock.axiosPatch,
    },
}))

vi.mock('@/composables/usePasswordValidators.ts', () => ({
    usePasswordValidators: () => ({
        passwordMatchingValidator: mock.passwordValidators.passwordMatchingValidator,
        passwordStrengthValidator: mock.passwordValidators.passwordStrengthValidator,
    }),
}))

vi.mock('@/stores/globalStore.ts', () => ({
    useGlobalStore: () => ({
        addNotify: mock.addNotify,
    }),
}))

describe('useResetPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mock.passwordValidators.passwordMatchingValidator.mockReturnValue(true)
        mock.passwordValidators.passwordStrengthValidator.mockReturnValue(true)
        mock.axiosPatch.mockResolvedValue({})
    })

    test('initial state should have empty passwords and token', () => {
        const { newPassword, confirmPassword, token, isLoading } = useResetPasswordForm()

        expect(newPassword.value).toBe('')
        expect(confirmPassword.value).toBe('')
        expect(token.value).toBe('')
        expect(isLoading.value).toBe(false)
    })

    test('should validate password strength', async () => {
        mock.passwordValidators.passwordStrengthValidator.mockReturnValue(false)

        const { resetPassword, newPassword } = useResetPasswordForm()
        newPassword.value = 'weak'

        await resetPassword()

        expect(mock.passwordValidators.passwordStrengthValidator).toHaveBeenCalledWith('weak')
        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.password.validation.passwordRequirements',
        })
        expect(mock.axiosPatch).not.toHaveBeenCalled()
    })

    test('should validate passwords match', async () => {
        mock.passwordValidators.passwordMatchingValidator.mockReturnValue(false)

        const { resetPassword, newPassword, confirmPassword } = useResetPasswordForm()
        newPassword.value = 'StrongPassword123!'
        confirmPassword.value = 'DifferentPassword123!'

        await resetPassword()

        expect(mock.passwordValidators.passwordMatchingValidator).toHaveBeenCalledWith(
            'StrongPassword123!',
            'DifferentPassword123!',
        )
        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.password.validation.passwordsDoNotMatch',
        })
        expect(mock.axiosPatch).not.toHaveBeenCalled()
    })

    test('should submit the form successfully', async () => {
        const { resetPassword, newPassword, confirmPassword, token, isLoading } = useResetPasswordForm()

        token.value = 'valid-reset-token'
        newPassword.value = 'NewPassword123!'
        confirmPassword.value = 'NewPassword123!'

        const resetPasswordPromise = resetPassword()

        expect(isLoading.value).toBe(true)

        await resetPasswordPromise
        await flushPromises()

        expect(mock.axiosPatch).toHaveBeenCalledWith('/user/reset-password/', {
            token: 'valid-reset-token',
            newPassword: 'NewPassword123!',
            confirmPassword: 'NewPassword123!',
        })

        expect(mock.addNotify).toHaveBeenCalledWith({
            type: 'positive',
            message: 'forms.password.reset.success',
        })

        expect(mock.routerPush).toHaveBeenCalledWith({ name: 'Home' })
        expect(isLoading.value).toBe(false)
    })

    test('should handle 400 error with token error from API', async () => {
        const axiosError = new AxiosError('Bad Request')
        axiosError.response = {
            data: { token: ['Invalid or expired token'] },
            statusText: '400',
            headers: {},
            config: {
                headers: {} as AxiosRequestHeaders,
            },
            status: 400,
        }

        mock.axiosPatch.mockRejectedValue(axiosError)

        const { resetPassword, newPassword, confirmPassword, token } = useResetPasswordForm()

        token.value = 'invalid-token'
        newPassword.value = 'NewPassword123!'
        confirmPassword.value = 'NewPassword123!'

        await resetPassword()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.password.reset.tokenRejected',
        })
    })

    test('should handle general errors from API', async () => {
        mock.axiosPatch.mockRejectedValue(new Error('Network error'))

        const { resetPassword, newPassword, confirmPassword, token } = useResetPasswordForm()

        token.value = 'valid-token'
        newPassword.value = 'NewPassword123!'
        confirmPassword.value = 'NewPassword123!'

        await resetPassword()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'errors.unknown',
        })
    })
})
