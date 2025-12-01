import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore.ts'
import { watch } from 'vue'

export const useProjectView = () => {
    const route = useRoute()
    const projectStore = useProjectStore()

    const watchRouteIdAndFetchProject = async () => {
        watch(
            () => route.params.id,
            async () => {
                const id = route.params.id as string
                if (projectStore.id === id) return

                projectStore.isLoading = true
                await projectStore.fetchProjectById(id)
                projectStore.isLoading = false
            },
            { immediate: true },
        )
    }

    return {
        watchRouteIdAndFetchProject,
    }
}
