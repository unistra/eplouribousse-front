import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useChangePasswordForm } from '../useChangePasswordForm'
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

describe('useChangePasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mock.passwordValidators.passwordMatchingValidator.mockReturnValue(true)
        mock.passwordValidators.passwordStrengthValidator.mockReturnValue(true)
        mock.axiosPatch.mockResolvedValue({})
    })

    test('initial state should have empty passwords', () => {
        const { oldPassword, newPassword, confirmPassword, isLoading } = useChangePasswordForm()

        expect(oldPassword.value).toBe('')
        expect(newPassword.value).toBe('')
        expect(confirmPassword.value).toBe('')
        expect(isLoading.value).toBe(false)
    })

    test('should validate password strength', async () => {
        mock.passwordValidators.passwordStrengthValidator.mockReturnValue(false)

        const { changePassword, newPassword } = useChangePasswordForm()
        newPassword.value = 'weak'

        await changePassword()

        expect(mock.passwordValidators.passwordStrengthValidator).toHaveBeenCalledWith('weak')
        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.changePassword.passwordRequirements',
        })
        expect(mock.axiosPatch).not.toHaveBeenCalled()
    })

    test('should validate passwords match', async () => {
        mock.passwordValidators.passwordMatchingValidator.mockReturnValue(false)

        const { changePassword, newPassword, confirmPassword } = useChangePasswordForm()
        newPassword.value = 'StrongPassword123!'
        confirmPassword.value = 'DifferentPassword123!'

        await changePassword()

        expect(mock.passwordValidators.passwordMatchingValidator).toHaveBeenCalledWith(
            'StrongPassword123!',
            'DifferentPassword123!',
        )
        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.changePassword.passwordsDoNotMatch',
        })
        expect(mock.axiosPatch).not.toHaveBeenCalled()
    })

    test('should submit the form successfully', async () => {
        const { changePassword, oldPassword, newPassword, confirmPassword, isLoading } = useChangePasswordForm()

        oldPassword.value = 'OldPassword123!'
        newPassword.value = 'NewPassword123!'
        confirmPassword.value = 'NewPassword123!'

        const changePasswordPromise = changePassword()

        expect(isLoading.value).toBe(true)

        await changePasswordPromise
        await flushPromises()

        expect(mock.axiosPatch).toHaveBeenCalledWith('/user/change-password/', {
            oldPassword: 'OldPassword123!',
            newPassword: 'NewPassword123!',
            confirmPassword: 'NewPassword123!',
        })

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'positive',
            message: 'forms.password.change.success',
        })

        expect(mock.routerPush).toHaveBeenCalledWith({ path: '/' })

        expect(oldPassword.value).toBe('')
        expect(newPassword.value).toBe('')
        expect(newPassword.value).toBe('')
        expect(confirmPassword.value).toBe('')
    })

    test('should handle 400 error from API', async () => {
        const axiosError = new AxiosError('Bad Request')
        axiosError.response = {
            data: undefined,
            statusText: '400',
            headers: {},
            config: {
                headers: {} as AxiosRequestHeaders,
            },
            status: 400,
        }

        mock.axiosPatch.mockRejectedValue(axiosError)

        const { changePassword, oldPassword, newPassword, confirmPassword } = useChangePasswordForm()

        oldPassword.value = 'IncorrectPassword123!'
        newPassword.value = 'NewPassword123!'
        confirmPassword.value = 'NewPassword123!'

        await changePassword()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.password.oldPasswordIncorrect',
        })

        expect(oldPassword.value).toBe('')
        expect(newPassword.value).toBe('')
        expect(confirmPassword.value).toBe('')
    })

    test('should handle general errors from API', async () => {
        mock.axiosPatch.mockRejectedValue(new Error('Network error'))

        const { changePassword, oldPassword, newPassword, confirmPassword } = useChangePasswordForm()

        oldPassword.value = 'OldPassword123!'
        newPassword.value = 'NewPassword123!'
        confirmPassword.value = 'NewPassword123!'

        await changePassword()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'errors.unknown',
        })

        expect(oldPassword.value).toBe('')
        expect(newPassword.value).toBe('')
        expect(confirmPassword.value).toBe('')
    })
})
