import { computed } from 'vue'
import { type DashboardTableData, useProjectDashboard } from './useProjectDashboard'

export const useProjectDashboardTable = () => {
    const { getData, data, loading } = useProjectDashboard<DashboardTableData>()

    const filteredTableDataKeys = computed(() => {
        if (!data.value) return []
        return Object.keys(data.value).filter((key) => key !== 'title' && key !== 'computedAt')
    })

    return {
        data,
        loading,
        getData,
        filteredTableDataKeys,
    }
}
