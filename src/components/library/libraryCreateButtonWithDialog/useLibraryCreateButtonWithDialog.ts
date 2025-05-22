import { reactive, ref } from 'vue'
import type { Library } from '#/library.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useLibraryStore } from '@/stores/libraryStore.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'

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

    const libraryStore = useLibraryStore()

    const createLibrary = async () => {
        try {
            const response = await axiosI.post<Library>('/libraries/', {
                name: library.name,
                alias: library.alias,
                code: library.code,
            })

            libraryStore.addLibrary(response.data)

            library.name = ''
            library.alias = ''
            library.code = ''

            dialog.value = false
        } catch {
            notify({
                type: 'error',
                message: t('errors.unknown'),
            })
        }
    }

    return {
        dialog,
        openDialog,
        library,
        createLibrary,
    }
}
