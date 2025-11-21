import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { ref } from 'vue'
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

export type ProjectDashboardChartType =
    | 'realized-positioning-per-library'
    | 'resources-to-instruct-per-library'
    | 'collection-occurrences-per-library'

export type ProjectDashboardChartComponentType = 'bar' | 'doughnut'

type ProjectDashboardType = ProjectDashboardTableType | ProjectDashboardChartType

export type DashboardTableData = {
    title: string
    computedAt: string
    [key: string]: string | number
}

type ChartDataset = {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
}

export type DashboardChartData = {
    title: string
    labels: string[]
    datasets: ChartDataset[]
    computedAt: string
}

export type ChartToDisplay = {
    type: ProjectDashboardChartType
    chartType: ProjectDashboardChartComponentType
    stacked?: boolean
}[]

export const useProjectDashboard = <T extends DashboardTableData | DashboardChartData>() => {
    const route = useRoute()
    const loading = ref<boolean>(false)
    const data = ref<T | undefined>()
    const { useHandleError } = useUtils()

    const tableToDisplay: ProjectDashboardTableType[] = [
        'initial-data',
        'positioning-information',
        'exclusion-information',
        'arbitration-information',
        'instruction-candidates-information',
        'instructions-information',
        'controls-information',
        'anomalies-information',
        'achievements-information',
    ]

    const chartToDisplay: ChartToDisplay = [
        { type: 'realized-positioning-per-library', chartType: 'bar' },
        { type: 'resources-to-instruct-per-library', chartType: 'bar', stacked: true },
        { type: 'collection-occurrences-per-library', chartType: 'bar' },
        { type: 'collection-occurrences-per-library', chartType: 'doughnut' },
    ]

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
            useHandleError(e)
        } finally {
            loading.value = false
        }
    }

    return {
        getData,
        data,
        loading,
        tableToDisplay,
        chartToDisplay,
    }
}
