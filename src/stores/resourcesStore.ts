import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Resource } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { type GetResources } from '#/resources.ts'
import { useProjectStore } from '@/stores/projectStore.ts'

export const useResourcesStore = defineStore('resources', () => {
    const { useHandleError } = useUtils()
    const projectStore = useProjectStore()

    // STATE ========================
    const resources = ref<Resource[]>([])
    const resourcesLoading = ref<boolean>(false)

    const libraryIdSelected = ref<string>('')
    const libraryIdComparedSelected = ref<string>('')

    // ACTIONS ========================
    const getResources: GetResources = async (params) => {
        resourcesLoading.value = true
        try {
            if (!params.project) params.project = projectStore.project?.id || ''
            if (!params.library && libraryIdSelected.value !== '') params.library = libraryIdSelected.value
            if (!params.against && libraryIdComparedSelected.value !== '')
                params.against = libraryIdComparedSelected.value

            const response = await axiosI.get<Pagination<Resource>>('/resources/', { params })
            resources.value = response.data.results

            return { count: response.data.count }
        } catch (e) {
            useHandleError(e)
        } finally {
            resourcesLoading.value = false
        }
    }

    return {
        // State
        resources,
        resourcesLoading,
        libraryIdSelected,
        libraryIdComparedSelected,
        // Actions
        getResources,
    }
})
