import { computed } from 'vue'
import type { ProjectDashboardTableType, DashboardTableData } from './useProjectDashboard'
import { useProjectDashboard } from './useProjectDashboard'

export const useProjectDashboardTable = () => {
    const { getData, data: tableData, loading } = useProjectDashboard<DashboardTableData>()

    const getTableData = async (type: ProjectDashboardTableType) => {
        await getData(type)
    }

    const filteredTableDataKeys = computed(() => {
        if (!tableData.value) return []
        return Object.keys(tableData.value).filter((key) => key !== 'title' && key !== 'computedAt')
    })

    return {
        getData: getTableData,
        tableData,
        filteredTableDataKeys,
        loading,
    }
}
