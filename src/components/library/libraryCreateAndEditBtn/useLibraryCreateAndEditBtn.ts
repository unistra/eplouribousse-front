import { reactive, ref } from 'vue'
import type { Library, LibraryI } from '#/library.d.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useLibraryStore } from '@/stores/libraryStore.ts'

export const useLibraryCreateAndEditBtn = (isToEdit: boolean, emit: (evt: 'submitted') => void) => {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()

    const dialog = {
        isOpen: ref(false),
        open: () => (dialog.isOpen.value = true),
        close: () => (dialog.isOpen.value = false),
    }

    const library = reactive<Library | LibraryI>({
        id: undefined,
        name: '',
        alias: '',
        code: '',
    })

    const errors = reactive({
        name: '',
        alias: '',
        code: '',
    })

    const resetErrors = () => {
        errors.name = ''
        errors.alias = ''
        errors.code = ''
    }

    const handleError = (error: unknown) => {
        if (error instanceof AxiosError && error.response?.data) {
            const responseErrors = error.response.data

            if (responseErrors.name) {
                errors.name = Array.isArray(responseErrors.name) ? responseErrors.name[0] : responseErrors.name
            }
            if (responseErrors.alias) {
                errors.alias = Array.isArray(responseErrors.alias) ? responseErrors.alias[0] : responseErrors.alias
            }
            if (responseErrors.code) {
                errors.code = Array.isArray(responseErrors.code) ? responseErrors.code[0] : responseErrors.code
            }
        } else {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const createLibrary = async () => {
        resetErrors()
        try {
            await axiosI.post<Library>('/libraries/', {
                name: library.name,
                alias: library.alias,
                code: library.code,
            })

            library.name = ''
            library.alias = ''
            library.code = ''

            dialog.close()
        } catch (error: unknown) {
            handleError(error)
        }
    }

    const updateLibrary = async () => {
        resetErrors()
        const notifyNotFound = () => {
            notify({
                type: 'negative',
                message: t('errors.library.notFound'),
            })
        }
        if (!('id' in library)) {
            notifyNotFound()
            return
        }

        const libraryStore = useLibraryStore()

        const originalLibrary = libraryStore.find(library)
        if (!originalLibrary) {
            notifyNotFound()
            return
        }

        const hasChanges =
            originalLibrary.name !== library.name ||
            originalLibrary.alias !== library.alias ||
            originalLibrary.code !== library.code

        if (!hasChanges) {
            dialog.close()
            return
        }

        try {
            await axiosI.patch<Library>(`/libraries/${library.id}/`, {
                name: library.name,
                alias: library.alias,
                code: library.code,
            })

            dialog.close()

            library.name = ''
            library.alias = ''
            library.code = ''
        } catch (error: unknown) {
            handleError(error)
        }
    }

    const onSubmit = async () => {
        const fn = isToEdit ? updateLibrary : createLibrary
        await fn()
        emit('submitted')
    }

    return {
        dialog,
        library,
        onSubmit,
        errors,
    }
}
