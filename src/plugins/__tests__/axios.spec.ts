import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { baseConfigAxios } from '~/fixtures/axios.ts'
import { axiosRequestInterceptor } from '@/plugins/axios.ts'

const mocks = vi.hoisted(() => ({
    location: {
        pathname: '/test',
        replace: vi.fn(),
    },
    localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    },
    jsonParse: vi.fn(),
    jsonStringify: vi.fn(),
    windowAtob: vi.fn(),
    mathTrunc: vi.fn(),
    redirectToLogin: vi.fn(),
    isExpired: vi.fn(),
    refreshToken: vi.fn(),
}))

vi.mock('@/plugins/useAxios.ts', async () => {
    return {
        redirectToLogin: mocks.redirectToLogin,
        isExpired: mocks.isExpired,
        refreshToken: mocks.refreshToken,
        skippedRoutes: [
            '/token/',
            '/api/user/reset-password/',
            '/api/user/send-reset-email/',
            '/api/user/login-handshake/',
            '/api/user/invite-handshake/',
            '/cas/login/',
            '/saml2/login/',
        ],
    }
})

const useLocalConfig = () => structuredClone(baseConfigAxios)

describe('axios', () => {
    beforeEach(() => {
        vi.resetAllMocks()

        vi.stubGlobal('localStorage', {
            getItem: mocks.localStorage.getItem,
            setItem: mocks.localStorage.setItem,
            removeItem: mocks.localStorage.removeItem,
        })
        vi.stubGlobal('window', {
            location: mocks.location,
            atob: mocks.windowAtob,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('should return config if url contains "/token/"', async () => {
        const localConfigAxios = useLocalConfig()
        localConfigAxios.url = '/saml2/login/'

        const result = await axiosRequestInterceptor(localConfigAxios)
        expect(result).toEqual(localConfigAxios)

        expect(mocks.redirectToLogin).not.toHaveBeenCalled()
        expect(mocks.isExpired).not.toHaveBeenCalled()
        expect(mocks.refreshToken).not.toHaveBeenCalled()
    })

    test('should execute login if access token is null', async () => {
        const localConfigAxios = useLocalConfig()
        mocks.localStorage.getItem.mockReturnValue(null)

        await axiosRequestInterceptor(localConfigAxios)

        expect(mocks.redirectToLogin).toHaveBeenCalled()
        expect(mocks.isExpired).not.toHaveBeenCalled()
        expect(mocks.refreshToken).not.toHaveBeenCalled()
    })

    test('should execute redirectToLogin if there is an expired access token and no refresh token', async () => {
        const localConfigAxios = useLocalConfig()
        mocks.localStorage.getItem.mockImplementation((key: string) => {
            if (key === 'JWT__access__token') {
                return 'expiredAccessToken'
            }
            if (key === 'JWT__refresh__token') {
                return null
            }
            return null
        })
        mocks.isExpired.mockReturnValue(true)

        await axiosRequestInterceptor(localConfigAxios)

        expect(mocks.redirectToLogin).toHaveBeenCalledOnce()
        expect(mocks.isExpired).toHaveBeenCalledOnce()
        expect(mocks.refreshToken).not.toHaveBeenCalled()
    })

    test('should execute redirectToLogin if there is an expired access token and an expired refresh token', async () => {
        const localConfigAxios = useLocalConfig()
        mocks.localStorage.getItem.mockReturnValue('expiredToken')
        mocks.isExpired.mockReturnValue(true)

        await axiosRequestInterceptor(localConfigAxios)

        expect(mocks.redirectToLogin).toHaveBeenCalledOnce()
        expect(mocks.isExpired).toHaveBeenCalledTimes(2)
        expect(mocks.refreshToken).not.toHaveBeenCalled()
        expect(mocks.localStorage.getItem).toHaveBeenCalledTimes(5)
    })

    test('should execute refresh if there is an expired access token and a valid refresh token', async () => {
        const localConfigAxios = useLocalConfig()
        mocks.localStorage.getItem.mockImplementation((key: string) => {
            if (key === 'JWT__access__token') {
                return 'expiredAccessToken'
            }
            if (key === 'JWT__refresh__token') {
                return 'validRefreshToken'
            }
            return null
        })
        mocks.isExpired.mockImplementation((key: string) => {
            if (key === 'expiredAccessToken') {
                return true
            }
            if (key === 'validRefreshToken') {
                return false
            }
            return false
        })

        await axiosRequestInterceptor(localConfigAxios)

        expect(mocks.redirectToLogin).not.toHaveBeenCalled()
        expect(mocks.isExpired).toHaveBeenCalledTimes(2)
        expect(mocks.refreshToken).toHaveBeenCalledOnce()
    })
})
