import type { ProjectDashboardChartType, DashboardChartData } from './useProjectDashboard'
import { useProjectDashboard } from './useProjectDashboard'

export const useProjectDashboardChart = () => {
    const { getData, data: chartData, loading } = useProjectDashboard<DashboardChartData>()

    const getChartData = async (type: ProjectDashboardChartType) => {
        await getData(type)
    }

    return {
        getData: getChartData,
        chartData,
        loading,
    }
}
