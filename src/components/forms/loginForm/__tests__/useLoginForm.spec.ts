import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useLoginForm } from '../useLoginForm'
import { flushPromises } from '@vue/test-utils'
import { AxiosError, type AxiosRequestHeaders } from 'axios'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        routerPush: vi.fn(),
        axios: {
            post: vi.fn(),
            get: vi.fn(),
            authGet: vi.fn(),
        },
        t: vi.fn((key) => key),
        localStorage: {
            setItem: vi.fn(),
            getItem: vi.fn(),
        },
        routeQuery: {
            redirect: null as null | string,
        },
        userStore: {
            isAuth: false,
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
    useRoute: () => ({
        query: mock.routeQuery,
    }),
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        post: mock.axios.post,
        get: mock.axios.get,
    },
    axiosAuth: {
        get: mock.axios.authGet,
    },
}))

vi.mock('@/stores/userStore.ts', () => ({
    useUserStore: () => mock.userStore,
}))

describe('useLoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mock.axios.post.mockResolvedValue({
            data: {
                refresh: 'refresh-token',
                access: 'access-token',
            },
        })
        mock.axios.get.mockResolvedValue({
            data: {
                username: 'testuser',
            },
        })
        mock.userStore.isAuth = false
        mock.routeQuery.redirect = null

        vi.stubGlobal('localStorage', {
            getItem: mock.localStorage.getItem,
            setItem: mock.localStorage.setItem,
        })
    })

    test('initial state should have empty credentials', () => {
        const { email, password, isLoading } = useLoginForm()

        expect(email.value).toBe('')
        expect(password.value).toBe('')
        expect(isLoading.value).toBe(false)
    })

    test('should login successfully', async () => {
        const { onLogin, email, password, isLoading } = useLoginForm()

        email.value = 'user@example.com'
        password.value = 'password123'

        const loginPromise = onLogin()

        expect(isLoading.value).toBe(true)

        await loginPromise
        await flushPromises()

        expect(mock.axios.post).toHaveBeenCalledWith('/token/', {
            username: 'user@example.com',
            password: 'password123',
        })

        expect(mock.axios.get).toHaveBeenCalledWith('/users/profile/')

        expect(mock.userStore.isAuth).toBe(true)
        expect(mock.localStorage.setItem).toHaveBeenCalledWith('JWT__access__token', 'access-token')
        expect(mock.localStorage.setItem).toHaveBeenCalledWith('JWT__refresh__token', 'refresh-token')

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'positive',
            message: 'forms.login.success',
        })

        expect(mock.routerPush).toHaveBeenCalledWith({ name: 'Home' })
        expect(isLoading.value).toBe(false)
    })

    test('should redirect to specified route if given', async () => {
        mock.routeQuery.redirect = '/dashboard'

        const { onLogin, email, password } = useLoginForm()

        email.value = 'user@example.com'
        password.value = 'password123'

        await onLogin()
        await flushPromises()

        expect(mock.routerPush).toHaveBeenCalledWith('/dashboard')
    })

    test('should handle 401 unauthorized error', async () => {
        const axiosError = new AxiosError('Unauthorized')
        axiosError.response = {
            data: undefined,
            statusText: '401',
            headers: {},
            config: {
                headers: {} as AxiosRequestHeaders,
            },
            status: 401,
        }

        mock.axios.post.mockRejectedValue(axiosError)

        const { onLogin, email, password } = useLoginForm()

        email.value = 'user@example.com'
        password.value = 'wrong-password'

        await onLogin()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.login.credentialsError',
        })

        expect(password.value).toBe('')
        expect(mock.userStore.isAuth).toBe(false)
    })

    test('should handle general errors', async () => {
        mock.axios.post.mockRejectedValue(new Error('Network error'))

        const { onLogin, email, password } = useLoginForm()

        email.value = 'user@example.com'
        password.value = 'password123'

        await onLogin()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'errors.unknown',
        })

        expect(password.value).toBe('')
        expect(mock.userStore.isAuth).toBe(false)
    })

    test('should handle Shibboleth login', async () => {
        const { loginViaShibbolet, isLoading } = useLoginForm()

        const loginPromise = loginViaShibbolet()

        expect(isLoading.value).toBe(true)

        await loginPromise

        expect(mock.axios.authGet).toHaveBeenCalledWith('/saml2/login/')
    })

    test('should handle error in Shibboleth login', async () => {
        mock.axios.authGet.mockRejectedValue(new Error('Network error'))

        const { loginViaShibbolet } = useLoginForm()

        await loginViaShibbolet()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'errors.unknown',
        })
    })
})
