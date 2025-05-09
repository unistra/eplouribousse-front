import { beforeEach, describe, expect, test, vi } from 'vitest'
import { isExpired } from '@/utils/jwt.ts'

const mocks = vi.hoisted(() => ({
    windowAtob: vi.fn(),
    jsonParse: vi.fn(),
}))

describe('isExpired()', () => {
    beforeEach(() => {
        vi.restoreAllMocks()

        vi.stubGlobal('window', {
            atob: mocks.windowAtob,
        })
        vi.stubGlobal('JSON', {
            parse: mocks.jsonParse,
        })
    })

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
