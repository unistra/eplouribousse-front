import type { LibraryI } from '#/library'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { ProjectLibrary } from '#/project.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'

export const useProjectLibraries = () => {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const projectStore = useProjectStore()

    const addLibraryDialog = ref<boolean>(false)

    const onAddLibrary = async (library: LibraryI) => {
        addLibraryDialog.value = false
        await addLibrary(library)
    }

    const addLibrary = async (library: LibraryI) => {
        if (!projectStore.project) throw new Error('No project selected')

        if (projectStore.project.libraries.some((lib) => lib.id === library.id)) return
        try {
            await axiosI.post(`/projects/${projectStore.project.id}/libraries/`, { library_id: library.id })

            const newLibrary: ProjectLibrary = { ...library, isAlternativeStorageSite: false }
            projectStore.project.libraries.push(newLibrary)
        } catch {
            notify({
                type: 'negative',
                message: t('errors.library.whileAdding'),
            })
            return
        }
    }
    return {
        onAddLibrary,
        addLibraryDialog,
    }
}
