import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export type ProjectDashboardTableType =
    | 'initial-data'
    | 'positioning-information'
    | 'exclusion-information'
    | 'arbitration-information'
    | 'instruction-candidates-information'
    | 'instructions-information'
    | 'controls-information'
    | 'anomalies-information'
    | 'achievements-information'

type DashboardData = {
    title: string
    computedAt: string
    [value: string]: string | number
}

export const useProjectDashboardTable = () => {
    const route = useRoute()
    const loading = ref<boolean>(false)

    const tableData = ref<DashboardData | undefined>()

    const filteredTableDataKeys = computed(() => {
        if (!tableData.value) return []
        return Object.keys(tableData.value).filter((key) => key !== 'title' && key !== 'computedAt')
    })

    const getData = async (type: ProjectDashboardTableType) => {
        loading.value = true
        try {
            const response = await axiosI.get<DashboardData>(`/projects/${route.params.id}/dashboard/`, {
                params: {
                    board: type,
                },
            })
            tableData.value = response.data
        } catch (e) {
            useUtils().useHandleError(e)
        } finally {
            loading.value = false
        }
    }

    return {
        getData,
        tableData,
        filteredTableDataKeys,
        loading,
    }
}
