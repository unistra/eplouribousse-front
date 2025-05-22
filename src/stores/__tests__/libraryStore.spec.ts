import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useLibraryStore } from '@/stores/libraryStore'
import { axiosI } from '@/plugins/axios/axios'
import type { Library } from '#/library.ts'

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
        expect(store.isLoading).toBe(false)
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
        expect(store.isLoading).toBe(false)
        expect(store.error).toBe(null)
    })

    test('fetchLibraries handles error', async () => {
        vi.mocked(axiosI.get).mockRejectedValue(new Error('API Error'))

        const store = useLibraryStore()
        await store.fetchLibraries()

        expect(axiosI.get).toHaveBeenCalledWith('/libraries/')
        expect(store.libraries.results).toEqual([])
        expect(store.isLoading).toBe(false)
        expect(store.error).toBe('Failed to fetch library')
    })

    test('addLibrary adds a library to results', () => {
        const store = useLibraryStore()
        const newLibrary: Library = { name: 'New Library', alias: 'newlib', code: 'test-code' }

        store.addLibrary({ ...newLibrary })

        expect(store.libraries.results).toContainEqual({ ...newLibrary })
        expect(store.libraries.results.length).toBe(1)
    })

    test('loading state is true during API call', async () => {
        // Create a promise that we can resolve manually
        let resolvePromise: (value: unknown) => void
        const promise = new Promise((resolve) => {
            resolvePromise = resolve
        })

        vi.mocked(axiosI.get).mockReturnValue(promise)

        const store = useLibraryStore()
        const fetchPromise = store.fetchLibraries()

        expect(store.isLoading).toBe(true)

        // Resolve the API call
        resolvePromise!({ data: { count: 0, next: null, previous: null, results: [] } })
        await fetchPromise

        expect(store.isLoading).toBe(false)
    })
})
