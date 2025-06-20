import { reactive, ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Library, LibraryI } from '#/library.d.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'

export const useLibraryDeleteBtn = (emit: (evt: 'submitted') => void) => {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()

    const dialog = reactive({
        value: false,
        open: () => (dialog.value = true),
        close: () => (dialog.value = false),
    })

    const library = ref<Omit<LibraryI, 'createdAt' | 'updatedAt'>>({
        id: '',
        name: '',
        alias: '',
        code: '',
    })

    const deleteLibrary = async () => {
        try {
            await axiosI.delete<Library>(`/libraries/${library.value.id}`)

            dialog.value = false
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const onDeleteLibrary = async () => {
        await deleteLibrary()
        emit('submitted')
    }

    return {
        dialog,
        library,
        onDeleteLibrary,
    }
}
