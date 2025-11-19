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
        if (projectStore.libraries.some((lib) => lib.id === library.id)) return
        try {
            await axiosI.post(`/projects/${projectStore.id}/libraries/`, { library_id: library.id })

            const newLibrary: ProjectLibrary = { ...library, isAlternativeStorageSite: false }
            projectStore.libraries.push(newLibrary)
        } catch {
            notify({
                type: 'negative',
                message: t('view.project.new.stepper.steps.libraries.errors.whileAdding'),
            })
            return
        }
    }
    return {
        onAddLibrary,
        addLibraryDialog,
    }
}
