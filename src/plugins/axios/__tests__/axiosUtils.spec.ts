import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { axiosI } from '@/plugins/axios/axios.ts'
import { redirectToLogin, refreshToken } from '@/plugins/axios/axiosUtils.ts'

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
