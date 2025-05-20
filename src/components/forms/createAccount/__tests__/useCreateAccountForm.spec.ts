import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useCreateAccountForm } from '../useCreateAccountForm'
import { flushPromises } from '@vue/test-utils'
import { AxiosError, type AxiosRequestHeaders } from 'axios'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        addNotify: vi.fn(),
        routerPush: vi.fn(),
        axiosPost: vi.fn(),
        t: vi.fn((key) => key),
        passwordValidators: {
            passwordMatchingValidator: vi.fn(),
            passwordStrengthValidator: vi.fn(),
        },
        route: {
            query: {
                t: 'valid-token' as string | undefined,
            },
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
    useRoute: () => mock.route,
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        post: mock.axiosPost,
    },
}))

vi.mock('@/stores/globalStore.ts', () => ({
    useGlobalStore: () => ({
        addNotify: mock.addNotify,
    }),
}))

vi.mock('@/composables/usePasswordValidators.ts', () => ({
    usePasswordValidators: () => ({
        passwordMatchingValidator: mock.passwordValidators.passwordMatchingValidator,
        passwordStrengthValidator: mock.passwordValidators.passwordStrengthValidator,
    }),
}))

describe('useCreateAccountForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mock.passwordValidators.passwordMatchingValidator.mockReturnValue(true)
        mock.passwordValidators.passwordStrengthValidator.mockReturnValue(true)
        mock.axiosPost.mockResolvedValue({ status: 200, data: { email: 'test@example.com' } })
        mock.route.query.t = 'valid-token'
    })

    test('initial state should have empty values', () => {
        const { email, password, confirmPassword, isLoading } = useCreateAccountForm()

        expect(email.value).toBe('')
        expect(password.value).toBe('')
        expect(confirmPassword.value).toBe('')
        expect(isLoading.value).toBe(false)
    })

    describe('fetchEmailFromToken', () => {
        test('fetchEmailFromToken should fetch email from token', async () => {
            const { fetchEmailFromToken, email } = useCreateAccountForm()

            await fetchEmailFromToken()

            expect(mock.axiosPost).toHaveBeenCalledWith('/users/invite-handshake/', {
                token: 'valid-token',
            })
            expect(email.value).toBe('test@example.com')
        })

        test('fetchEmailFromToken should handle missing token', async () => {
            mock.route.query.t = undefined

            const { fetchEmailFromToken } = useCreateAccountForm()

            await fetchEmailFromToken()

            expect(mock.addNotify).toHaveBeenCalledWith({
                type: 'negative',
                message: 'forms.createAccount.missingToken',
            })
            expect(mock.routerPush).toHaveBeenCalledWith({ name: 'Home' })
            expect(mock.axiosPost).not.toHaveBeenCalled()
        })

        test('fetchEmailFromToken should handle invalid response', async () => {
            mock.axiosPost.mockResolvedValue({ status: 200, data: {} })

            const { fetchEmailFromToken } = useCreateAccountForm()

            await fetchEmailFromToken()

            expect(mock.addNotify).toHaveBeenCalledWith({
                type: 'negative',
                message: 'forms.createAccount.fetchEmailFailed',
                timeout: 8000,
            })
            expect(mock.routerPush).toHaveBeenCalledWith({ name: 'Home' })
        })

        test('fetchEmailFromToken should handle 403 error', async () => {
            const axiosError = new AxiosError('Forbidden')
            axiosError.response = {
                data: undefined,
                statusText: 'Forbidden',
                headers: {},
                config: {
                    headers: {} as AxiosRequestHeaders,
                },
                status: 403,
            }

            mock.axiosPost.mockRejectedValue(axiosError)

            const { fetchEmailFromToken } = useCreateAccountForm()

            await fetchEmailFromToken()

            expect(mock.addNotify).toHaveBeenCalledWith({
                type: 'negative',
                message: 'forms.createAccount.tokenRejected',
                timeout: 8000,
            })
            expect(mock.routerPush).toHaveBeenCalledWith({ name: 'Home' })
        })

        test('fetchEmailFromToken should handle general error', async () => {
            mock.axiosPost.mockRejectedValue(new Error('Network error'))

            const { fetchEmailFromToken } = useCreateAccountForm()

            await fetchEmailFromToken()

            expect(mock.addNotify).toHaveBeenCalledWith({
                type: 'negative',
                message: 'errors.unknownRetry',
                timeout: 8000,
            })
            expect(mock.routerPush).toHaveBeenCalledWith({ name: 'Home' })
        })
    })

    describe('createAccount', () => {
        test('createAccount should validate password strength', async () => {
            mock.passwordValidators.passwordStrengthValidator.mockReturnValue(false)

            const { createAccount, password } = useCreateAccountForm()
            password.value = 'weak'

            await createAccount()

            expect(mock.passwordValidators.passwordStrengthValidator).toHaveBeenCalledWith('weak')
            expect(mock.notify).toHaveBeenCalledWith({
                type: 'negative',
                message: 'forms.password.validation.passwordRequirements',
            })
            expect(mock.axiosPost).not.toHaveBeenCalled()
        })

        test('createAccount should validate passwords match', async () => {
            mock.passwordValidators.passwordMatchingValidator.mockReturnValue(false)

            const { createAccount, password, confirmPassword } = useCreateAccountForm()
            password.value = 'StrongPassword123!'
            confirmPassword.value = 'DifferentPassword123!'

            await createAccount()

            expect(mock.passwordValidators.passwordMatchingValidator).toHaveBeenCalledWith(
                'StrongPassword123!',
                'DifferentPassword123!',
            )
            expect(mock.notify).toHaveBeenCalledWith({
                type: 'negative',
                message: 'forms.password.validation.passwordsDoNotMatch',
            })
            expect(mock.axiosPost).not.toHaveBeenCalled()
        })

        test('createAccount should submit the form successfully', async () => {
            const { createAccount, password, confirmPassword, isLoading } = useCreateAccountForm()

            password.value = 'StrongPassword123!'
            confirmPassword.value = 'StrongPassword123!'

            const createAccountPromise = createAccount()

            expect(isLoading.value).toBe(true)

            await createAccountPromise
            await flushPromises()

            expect(mock.axiosPost).toHaveBeenCalledWith('/user/create-account/', {
                token: 'valid-token',
                password: 'StrongPassword123!',
                confirmPassword: 'StrongPassword123!',
            })

            expect(mock.addNotify).toHaveBeenCalledWith({
                type: 'positive',
                message: 'forms.createAccount.accountCreated',
            })

            expect(mock.routerPush).toHaveBeenCalledWith({ name: 'Home' })
            expect(isLoading.value).toBe(false)
        })

        test('createAccount should handle errors from API', async () => {
            mock.axiosPost.mockRejectedValue(new Error('Network error'))

            const { createAccount, password, confirmPassword } = useCreateAccountForm()

            password.value = 'StrongPassword123!'
            confirmPassword.value = 'StrongPassword123!'

            await createAccount()

            expect(mock.notify).toHaveBeenCalledWith({
                type: 'negative',
                message: 'errors.unknownRetry',
            })
        })
    })
})
