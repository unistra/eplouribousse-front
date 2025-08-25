import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { axiosI } from '@/plugins/axios/axios.ts'
import { isRouteAllowed, redirectionOrAddAuth, redirectToLogin, refreshToken } from '@/plugins/axios/axiosUtils.ts'
import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'

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
    isExpired: vi.fn(),
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

    describe('isRouteAllowed', () => {
        test('should return true for anon routes that are in allowedRoutesToAnon', () => {
            expect(isRouteAllowed('anon', '/token/refresh/')).toBe(true)
            expect(isRouteAllowed('anon', '/users/reset-password/')).toBe(true)
            expect(isRouteAllowed('anon', '/users/reset-password/123/')).toBe(true)
            expect(isRouteAllowed('anon', '/saml2/login/')).toBe(true)
        })

        test('should return false for anon routes that are not in allowedRoutesToAnon', () => {
            expect(isRouteAllowed('anon', '/api/users/')).toBe(false)
            expect(isRouteAllowed('anon', '/dashboard/')).toBe(false)
        })

        test('should return true for anonAndAuth routes that are in allowedRoutesToAnonAndAuth', () => {
            expect(isRouteAllowed('anonAndAuth', '/projects/')).toBe(true)
            expect(isRouteAllowed('anonAndAuth', '/projects/123/')).toBe(true)
        })

        test('should return false for anonAndAuth routes that are not in allowedRoutesToAnonAndAuth', () => {
            expect(isRouteAllowed('anonAndAuth', '/api/users/')).toBe(false)
            expect(isRouteAllowed('anonAndAuth', '/token/refresh/')).toBe(false)
        })

        test('should return false if url is undefined', () => {
            expect(isRouteAllowed('anon', undefined)).toBe(false)
            expect(isRouteAllowed('anonAndAuth', undefined)).toBe(false)
        })
    })

    describe('redirectionOrAddAuth', () => {
        let config: InternalAxiosRequestConfig<unknown>

        beforeEach(() => {
            config = {
                headers: {} as AxiosRequestHeaders,
            }
            vi.spyOn(axiosI, 'post').mockResolvedValue({
                data: { access: 'new-access-token' },
            })
        })

        test('should not redirect for refreshOrAbort=true even without tokens', async () => {
            mocks.localStorage.getItem.mockReturnValue(null)

            const result = await redirectionOrAddAuth(config, true)

            expect(mocks.location.replace).not.toHaveBeenCalled()
            expect(result).toEqual(config)
        })

        test('should redirect to login if access token is null and refreshOrAbort=false', async () => {
            mocks.localStorage.getItem.mockReturnValue(null)

            await redirectionOrAddAuth(config, false)

            expect(window.location.replace).toHaveBeenCalledWith('/login?redirect=/test')
        })
    })
})
