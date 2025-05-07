import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { axiosI } from '@/plugins/axios.ts'
import { useAxios } from '@/composables/useAxios'

const { isExpired, redirectToLogin, refreshToken } = useAxios()
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
    windowAtob: vi.fn(),
    jsonParse: vi.fn(),
    axiosPost: vi.fn(),
}))

describe('axios utils', () => {
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
        vi.stubGlobal('JSON', {
            parse: mocks.jsonParse,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('redirectToLogin()', () => {
        test('should remove tokens and redirect to login', () => {
            redirectToLogin()
            expect(localStorage.removeItem).toHaveBeenCalledWith('JWT__access__token')
            expect(localStorage.removeItem).toHaveBeenCalledWith('JWT__refresh__token')
            expect(window.location.replace).toHaveBeenCalledWith(`/login?redirect=${mocks.location.pathname}`)
        })
    })

    describe('isExpired()', () => {
        test('should return true if token is expired', () => {
            mocks.windowAtob.mockReturnValue('{"exp":123}')
            mocks.jsonParse.mockReturnValue({ exp: Math.trunc(Date.now() / 1000) - 3600 }) // Set exp to 1 hour in the past

            const result = isExpired('test')

            expect(result).toBe(true)
            expect(mocks.windowAtob).toHaveBeenCalled()
            expect(mocks.jsonParse).toHaveBeenCalled()
        })

        test('should return false if token is not expired', () => {
            // Setup mocks
            mocks.windowAtob.mockReturnValue('{"exp":123}')
            mocks.jsonParse.mockReturnValue({ exp: Math.trunc(Date.now() / 1000) + 3600 }) // Set exp to 1 hour in the future

            const result = isExpired('test')

            expect(result).toBe(false)
            expect(mocks.windowAtob).toHaveBeenCalled()
            expect(mocks.jsonParse).toHaveBeenCalled()
        })
    })

    describe('refreshToken', () => {
        test('should call axiosI.post with the correct URL and data', async () => {
            vi.spyOn(axiosI, 'post').mockResolvedValue({
                data: { access: 'new-access-token' },
            })
            mocks.localStorage.getItem.mockReturnValue('refresh-token')

            await refreshToken()

            expect(axiosI.post).toHaveBeenCalledWith('/token/refresh/', { refresh: 'refresh-token' })
            expect(mocks.localStorage.setItem).toHaveBeenCalledWith('JWT__access__token', 'new-access-token')
        })
    })
})
