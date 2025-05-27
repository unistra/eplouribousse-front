import { reactive, ref } from 'vue'
import type { Library } from '#/library.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useLibraryStore } from '@/stores/libraryStore.ts'

export const useLibraryCreateButtonWithDialog = () => {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()

    const dialog = ref<boolean>(false)
    const openDialog = () => (dialog.value = true)

    const library = reactive<Library>({
        name: '',
        alias: '',
        code: '',
    })

    const nameError = ref<string | undefined>(undefined)
    const aliasError = ref<string | undefined>(undefined)
    const codeError = ref<string | undefined>(undefined)

    const resetErrors = () => {
        nameError.value = undefined
        aliasError.value = undefined
        codeError.value = undefined
    }

    const handleError = (error: unknown) => {
        if (error instanceof AxiosError && error.response?.data) {
            const errors = error.response.data

            const errorFields = {
                name: nameError,
                alias: aliasError,
                code: codeError,
            }

            for (const [field, errorRef] of Object.entries(errorFields)) {
                if (errors[field]) {
                    errorRef.value = Array.isArray(errors[field]) ? errors[field][0] : errors[field]
                }
            }
        } else {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const updateLibraryStore = async () => {
        const libraryStore = useLibraryStore()
        try {
            await libraryStore.fetchLibraries({
                page: 1,
                pageSize: 10,
                sortBy: 'name',
                descending: false,
            })
        } catch (error) {
            handleError(error)
        }
    }

    const createLibrary = async (updateStore: boolean = false) => {
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

            dialog.value = false

            if (updateStore) await updateLibraryStore()
        } catch (error: unknown) {
            handleError(error)
        }
    }

    const updateLibrary = async (updateStore: boolean = false) => {
        resetErrors()

        const libraryStore = useLibraryStore()
        const originalLibrary = libraryStore.libraries.results.find((lib) => lib.id === library.id)

        if (!originalLibrary) {
            notify({
                type: 'negative',
                message: t('libraries.errors.notFound'),
            })
            return
        }

        const hasChanges =
            originalLibrary.name !== library.name ||
            originalLibrary.alias !== library.alias ||
            originalLibrary.code !== library.code

        if (!hasChanges) {
            dialog.value = false
            return
        }

        try {
            await axiosI.patch<Library>(`/libraries/${library.id}/`, {
                name: library.name,
                alias: library.alias,
                code: library.code,
            })

            dialog.value = false
            if (updateStore) await updateLibraryStore()

            library.name = ''
            library.alias = ''
            library.code = ''
        } catch (error: unknown) {
            handleError(error)
        }
    }

    return {
        dialog,
        openDialog,
        library,
        createLibrary,
        nameError,
        aliasError,
        codeError,
        updateLibrary,
    }
}
