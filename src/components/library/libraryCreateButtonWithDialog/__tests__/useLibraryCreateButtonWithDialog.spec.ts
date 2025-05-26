import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useLibraryCreateButtonWithDialog } from '../useLibraryCreateButtonWithDialog.ts'
import { flushPromises } from '@vue/test-utils'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        axiosPost: vi.fn(),
        t: vi.fn((key) => key),
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

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        post: mock.axiosPost,
    },
}))

describe('useLibraryCreateButtonWithDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mock.axiosPost.mockResolvedValue({ data: {} })
    })

    test('initial state should have empty library fields and closed dialog', () => {
        const { library, dialog } = useLibraryCreateButtonWithDialog()

        expect(library.name).toBe('')
        expect(library.alias).toBe('')
        expect(library.code).toBe('')
        expect(dialog.value).toBe(false)
    })

    const setupTests = async () => {
        const { createLibrary, library, dialog } = useLibraryCreateButtonWithDialog()

        library.name = 'Test Library'
        library.alias = 'test'
        library.code = 'TL'
        dialog.value = true

        await createLibrary()
        await flushPromises()

        return { library, dialog }
    }

    test('should create a library and update the store successfully', async () => {
        const mockLibraryResponse = {
            data: {
                name: 'Test Library',
                alias: 'test',
                code: 'TL',
            },
        }
        mock.axiosPost.mockResolvedValue(mockLibraryResponse)

        const { library, dialog } = await setupTests()

        expect(mock.axiosPost).toHaveBeenCalledWith('/libraries/', {
            name: 'Test Library',
            alias: 'test',
            code: 'TL',
        })

        expect(library.name).toBe('')
        expect(library.alias).toBe('')
        expect(library.code).toBe('')
        expect(dialog.value).toBe(false)
    })

    test('should handle error during library creation', async () => {
        mock.axiosPost.mockRejectedValue(new Error('API error'))

        const { library, dialog } = await setupTests()

        expect(mock.axiosPost).toHaveBeenCalledWith('/libraries/', {
            name: 'Test Library',
            alias: 'test',
            code: 'TL',
        })

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'errors.unknown',
        })

        expect(library.name).toBe('Test Library')
        expect(library.alias).toBe('test')
        expect(library.code).toBe('TL')
        expect(dialog.value).toBe(true)
    })
})
