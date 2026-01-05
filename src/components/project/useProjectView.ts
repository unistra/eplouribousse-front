import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore.ts'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

export const useProjectView = () => {
    const route = useRoute()
    const projectStore = useProjectStore()
    const { t } = useI18n()

    const watchRouteIdAndFetchProject = async () => {
        watch(
            () => route.params.id,
            async () => {
                const id = route.params.id as string
                if (projectStore.project && projectStore.project.id === id) return

                projectStore.projectLoading = true
                await projectStore.getProject(id)
                document.title = `${t('fn.project.i')} | ${projectStore.project?.name}`
                projectStore.projectLoading = false
            },
            { immediate: true },
        )
    }

    return {
        watchRouteIdAndFetchProject,
    }
}
