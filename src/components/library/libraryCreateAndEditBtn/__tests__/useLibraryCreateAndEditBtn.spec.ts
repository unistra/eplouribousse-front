import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useLibraryCreateAndEditBtn } from '../useLibraryCreateAndEditBtn.ts'
import { flushPromises } from '@vue/test-utils'
import { AxiosError, type AxiosResponse } from 'axios'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        axiosPost: vi.fn(),
        axiosPatch: vi.fn(),
        t: vi.fn((key) => key),
        find: vi.fn(),
        emit: vi.fn(),
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
        patch: mock.axiosPatch,
    },
}))

vi.mock('@/stores/libraryStore.ts', () => ({
    useLibraryStore: () => ({
        find: mock.find,
    }),
}))

describe('useLibraryCreateAndEditBtn', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mock.axiosPost.mockResolvedValue({ data: {} })
        mock.axiosPatch.mockResolvedValue({ data: {} })
        mock.emit.mockReset()
    })

    test('initial state should have empty library fields and closed dialog', () => {
        const { library, dialog, errors } = useLibraryCreateAndEditBtn(false, mock.emit)

        expect(library.name).toBe('')
        expect(library.alias).toBe('')
        expect(library.code).toBe('')
        expect(dialog.isOpen.value).toBe(false)
        expect(errors.name).toBe('')
        expect(errors.alias).toBe('')
        expect(errors.code).toBe('')
    })

    test('dialog.open should set isOpen to true', () => {
        const { dialog } = useLibraryCreateAndEditBtn(false, mock.emit)
        dialog.open()
        expect(dialog.isOpen.value).toBe(true)
    })

    test('dialog.close should set isOpen to false', () => {
        const { dialog } = useLibraryCreateAndEditBtn(false, mock.emit)
        dialog.isOpen.value = true
        dialog.close()
        expect(dialog.isOpen.value).toBe(false)
    })

    test('should create a library successfully and reset form', async () => {
        const { library, dialog, onSubmit } = useLibraryCreateAndEditBtn(false, mock.emit)

        library.name = 'Test Library'
        library.alias = 'test'
        library.code = 'TL'

        await onSubmit()
        await flushPromises()

        expect(mock.axiosPost).toHaveBeenCalledWith('/libraries/', {
            name: 'Test Library',
            alias: 'test',
            code: 'TL',
        })

        expect(mock.emit).toHaveBeenCalledWith('submitted')
        expect(library.name).toBe('')
        expect(library.alias).toBe('')
        expect(library.code).toBe('')
        expect(dialog.isOpen.value).toBe(false)
    })

    test('should handle API validation errors during creation', async () => {
        const errorResponse = new AxiosError('', '', undefined, undefined, {
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            data: {
                name: 'Name is required',
                alias: 'Invalid alias',
                code: 'Code must be unique',
            },
            config: {},
        } as AxiosResponse)
        mock.axiosPost.mockRejectedValue(errorResponse)

        const { library, errors, onSubmit } = useLibraryCreateAndEditBtn(false, mock.emit)

        library.name = 'Test Library'
        library.alias = 'test'
        library.code = 'TL'

        await onSubmit()
        await flushPromises()

        expect(mock.axiosPost).toHaveBeenCalled()
        expect(errors.name).toBe('Name is required')
        expect(errors.alias).toBe('Invalid alias')
        expect(errors.code).toBe('Code must be unique')
    })

    test('should handle generic error during creation', async () => {
        mock.axiosPost.mockRejectedValue(new Error('API error'))

        const { library, onSubmit } = useLibraryCreateAndEditBtn(false, mock.emit)

        library.name = 'Test Library'
        library.alias = 'test'
        library.code = 'TL'

        await onSubmit()
        await flushPromises()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'errors.unknown',
        })
    })

    test('should update library successfully', async () => {
        mock.find.mockReturnValue({
            id: '1',
            name: 'Original Name',
            alias: 'original',
            code: 'OG',
        })

        const { library, dialog, onSubmit } = useLibraryCreateAndEditBtn(true, mock.emit)

        library.id = '1'
        library.name = 'Updated Library'
        library.alias = 'updated'
        library.code = 'UP'

        await onSubmit()
        await flushPromises()

        expect(mock.axiosPatch).toHaveBeenCalledWith('/libraries/1/', {
            name: 'Updated Library',
            alias: 'updated',
            code: 'UP',
        })

        expect(mock.emit).toHaveBeenCalledWith('submitted')
        expect(dialog.isOpen.value).toBe(false)
        expect(library.name).toBe('')
        expect(library.alias).toBe('')
        expect(library.code).toBe('')
    })

    test('should not update if library not found', async () => {
        mock.find.mockReturnValue(undefined)

        const { library, onSubmit } = useLibraryCreateAndEditBtn(true, mock.emit)

        library.id = '1'
        library.name = 'Updated Library'

        await onSubmit()
        await flushPromises()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'libraries.errors.notFound',
        })
        expect(mock.axiosPatch).not.toHaveBeenCalled()
    })

    test('should close dialog without update if no changes', async () => {
        const originalLibrary = {
            id: '1',
            name: 'Same Library',
            alias: 'same',
            code: 'SM',
        }
        mock.find.mockReturnValue(originalLibrary)

        const { library, dialog, onSubmit } = useLibraryCreateAndEditBtn(true, mock.emit)

        library.id = '1'
        library.name = 'Same Library'
        library.alias = 'same'
        library.code = 'SM'

        await onSubmit()
        await flushPromises()

        expect(mock.axiosPatch).not.toHaveBeenCalled()
        expect(dialog.isOpen.value).toBe(false)
        expect(mock.emit).toHaveBeenCalledWith('submitted')
    })
})
