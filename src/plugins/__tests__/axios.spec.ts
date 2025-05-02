import { describe, test, expect, vi, beforeEach } from 'vitest'

vi.mock('@/plugins/useAxios.ts', async () => {
    const actual = await vi.importActual('@/plugins/useAxios.ts')
    return {
        ...actual,
        redirectToLogin: vi.fn(),
        isExpired: vi.fn(),
        refreshToken: vi.fn(),
    }
})

import { baseConfigAxios } from '~/fixtures/axios.ts'
import * as axiosModule from '@/plugins/useAxios.ts'

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
}))

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

    test.skip('should return config if url contains "/token/"', async () => {
        const localConfigAxios = useLocalConfig()
        localConfigAxios.url = '/token/refresh/'

        const result = await axiosModule.axiosRequestInterceptor(localConfigAxios)
        expect(result).toEqual(localConfigAxios)

        expect(axiosModule.redirectToLogin).not.toHaveBeenCalled()
        expect(axiosModule.isExpired).not.toHaveBeenCalled()
        expect(axiosModule.refreshToken).not.toHaveBeenCalled()
    })

    test.skip('should execute login if access token is null', async () => {
        const localConfigAxios = useLocalConfig()
        mocks.localStorage.getItem.mockReturnValue(null)

        await axiosModule.axiosRequestInterceptor(localConfigAxios)

        expect(axiosModule.redirectToLogin).toHaveBeenCalled()
        expect(axiosModule.isExpired).not.toHaveBeenCalled()
        expect(axiosModule.refreshToken).not.toHaveBeenCalled()
    })
    test.skip('should execute login if there is an expired access token and no refresh token', async () => {})
    test.skip('should execute login if there is an expired access token and an expired refresh token', async () => {})
    test.skip('should execute refresh if there is an expired access token and a valid refresh token', async () => {})
})
