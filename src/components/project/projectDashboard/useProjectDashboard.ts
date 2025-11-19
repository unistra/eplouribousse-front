import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// Types de tables
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

// Types de graphiques
export type ProjectDashboardChartType =
    | 'realized-positioning-per-library'
    | 'resources-to-instruct-per-library'
    | 'collection-occurrences-per-library'

// Type union pour le composable générique
export type ProjectDashboardType = ProjectDashboardTableType | ProjectDashboardChartType

// Types de données
export type DashboardTableData = {
    title: string
    computedAt: string
    [key: string]: string | number
}

export type ChartDataset = {
    label: string
    data: number[]
}

export type DashboardChartData = {
    title: string
    labels: string[]
    datasets: ChartDataset[]
    computedAt: string
}

// Composable générique
export const useProjectDashboard = <T extends DashboardTableData | DashboardChartData>() => {
    const route = useRoute()
    const loading = ref<boolean>(false)
    const data = ref<T | undefined>()

    const getData = async (type: ProjectDashboardType) => {
        loading.value = true
        try {
            const response = await axiosI.get<T>(`/projects/${route.params.id}/dashboard/`, {
                params: {
                    board: type,
                },
            })
            data.value = response.data
        } catch (e) {
            useUtils().useHandleError(e)
        } finally {
            loading.value = false
        }
    }

    return {
        getData,
        data,
        loading,
    }
}
