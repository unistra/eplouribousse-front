import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useLibraryStore } from '@/stores/libraryStore'
import { axiosI } from '@/plugins/axios/axios'

vi.mock('@/plugins/axios/axios', () => ({
    axiosI: {
        get: vi.fn(),
        post: vi.fn(),
    },
}))

describe('LibraryStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())

        vi.clearAllMocks()
    })

    test('initializes with empty libraries', () => {
        const store = useLibraryStore()

        expect(store.libraries.results).toEqual([])
        expect(store.libraries.count).toBe(0)
        expect(store.error).toBe(null)
    })

    test('fetchLibraries updates libraries on success', async () => {
        const mockLibraries = {
            count: 2,
            next: null,
            previous: null,
            results: [
                { id: 1, name: 'Library 1', alias: 'lib1', code: 'L1' },
                { id: 2, name: 'Library 2', alias: 'lib2', code: 'L2' },
            ],
        }

        // Mock successful API response
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockLibraries })

        const store = useLibraryStore()
        await store.fetchLibraries()

        expect(axiosI.get).toHaveBeenCalledWith('/libraries/')
        expect(store.libraries).toEqual(mockLibraries)
        expect(store.error).toBe(null)
    })

    test('fetchLibraries handles error', async () => {
        vi.mocked(axiosI.get).mockRejectedValue(new Error('API Error'))

        const store = useLibraryStore()
        await store.fetchLibraries()

        expect(axiosI.get).toHaveBeenCalledWith('/libraries/')
        expect(store.libraries.results).toEqual([])
        expect(store.error).toBe('Failed to fetch library')
    })
})
