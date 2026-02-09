import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Resource } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { type GetResources } from '#/resources.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { PositioningFilter, ResourceStatus } from '&/project.ts'
import type { QTableProps } from 'quasar'

export const useResourcesStore = defineStore('resources', () => {
    const { useHandleError } = useUtils()
    const projectStore = useProjectStore()

    // STATE ========================
    const resources = ref<Resource[]>([])
    const resourcesLoading = ref<boolean>(false)

    const libraryIdSelected = ref<string>('')
    const libraryIdComparedSelected = ref<string>('')

    //// Table options
    // They stay in store so table pagination can be restored when refetching resources
    const filter = ref<string>('')
    const positioningFilter = ref<PositioningFilter>(PositioningFilter.All)
    const pagination = ref<NonNullable<QTableProps['pagination']>>({
        sortBy: 'title',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
    })
    // ACTIONS ========================
    const getResources: GetResources = async (params) => {
        resourcesLoading.value = true
        try {
            params.project = projectStore.project?.id || ''
            params.search = filter.value
            if (libraryIdSelected.value !== '') params.library = libraryIdSelected.value
            if (libraryIdComparedSelected.value !== '') params.against = libraryIdComparedSelected.value

            if (!params.ordering)
                params.ordering = `${pagination.value.descending ? '-' : ''}${pagination.value.sortBy}`
            if (positioningFilter.value === PositioningFilter.Arbitation) params.arbitration = 'all'
            if (params.status[0] === ResourceStatus.Positioning) params.positioning_filter = positioningFilter.value

            const response = await axiosI.get<Pagination<Resource>>('/resources/', { params })
            resources.value = response.data.results

            pagination.value.rowsNumber = response.data.count || 0
        } catch (e) {
            useHandleError(e)
        } finally {
            resourcesLoading.value = false
        }
    }

    const updatePagination = (options: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
        pagination.value.page = options.pagination.page
        pagination.value.rowsPerPage = options.pagination.rowsPerPage
        pagination.value.sortBy = options.pagination.sortBy
        pagination.value.descending = options.pagination.descending
    }

    return {
        // State
        resources,
        resourcesLoading,
        libraryIdSelected,
        libraryIdComparedSelected,
        filter,
        positioningFilter,
        pagination,
        // Actions
        getResources,
        updatePagination,
    }
})
