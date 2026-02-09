import type {
    DashboardChartData,
    ProjectDashboardChartComponentType,
    ProjectDashboardChartType,
} from './useProjectDashboard'
import { useProjectDashboard } from './useProjectDashboard'
import { computed } from 'vue'
import { Chart, type ChartData, type ChartOptions } from 'chart.js'
import { merge } from 'chart.js/helpers'

export type ProjectDashboardChartProps = {
    type: ProjectDashboardChartType
    chartType: ProjectDashboardChartComponentType
    stacked?: boolean
    chartOptions?: ChartOptions<ProjectDashboardChartComponentType>
}

const CHART_COLORS = {
    PALETTE: [
        '#76af8f',
        '#f3c260',
        '#888fc2',
        '#e38a77',
        '#E4B4D3',
        '#A7B06F',
        '#B36B6B',
        '#9E63B0',
        '#BA8454',
        '#D4D46C',
    ] as const,
    BORDER: '#ffffff',
    LEGEND_NEUTRAL: '#C0C0C0',
} as const

const CHART_DEFAULTS = {
    borderWidth: 2,
    hatchSize: 10,
    hatchOpacity: 0.2,
    hatchLineWidth: 2,
} as const

const createHatchPattern = (color: string): string | CanvasPattern => {
    const patternCanvas = document.createElement('canvas')
    const patternContext = patternCanvas.getContext('2d')
    if (!patternContext) return color

    const { hatchSize, hatchOpacity, hatchLineWidth } = CHART_DEFAULTS
    patternCanvas.width = hatchSize
    patternCanvas.height = hatchSize

    patternContext.fillStyle = color
    patternContext.fillRect(0, 0, hatchSize, hatchSize)

    patternContext.strokeStyle = `rgba(0, 0, 0, ${hatchOpacity})`
    patternContext.lineWidth = hatchLineWidth
    patternContext.beginPath()
    patternContext.moveTo(0, hatchSize)
    patternContext.lineTo(hatchSize, 0)
    patternContext.stroke()

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    return ctx?.createPattern(patternCanvas, 'repeat') ?? color
}

const isStackedBar = (chartType: ProjectDashboardChartComponentType, stacked?: boolean) =>
    chartType === 'bar' && stacked

const formatStackedBarDatasets = (rawDatasets: Record<string, unknown>[], baseColors: string[]) => {
    return rawDatasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: index === 1 ? baseColors.map(createHatchPattern) : baseColors,
        borderColor: CHART_COLORS.BORDER,
        borderWidth: CHART_DEFAULTS.borderWidth,
    }))
}

const formatDefaultDatasets = (rawDatasets: Record<string, unknown>[]) => {
    return rawDatasets.map((dataset) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor ?? CHART_COLORS.PALETTE,
        borderColor: dataset.borderColor ?? CHART_COLORS.BORDER,
        borderWidth: dataset.borderWidth ?? CHART_DEFAULTS.borderWidth,
    }))
}

const getColorsByIndex = (count: number, palette: readonly string[]): string[] => {
    if (palette.length === 0) return Array.from({ length: count }, () => '')
    return Array.from({ length: count }, (_, idx) => palette[idx % palette.length] ?? '')
}

const generateStackedBarLegendLabels = (chart: Chart) => {
    return chart.data.datasets.map((dataset, index) => ({
        text: dataset.label || '',
        fillStyle: index === 1 ? createHatchPattern(CHART_COLORS.LEGEND_NEUTRAL) : CHART_COLORS.LEGEND_NEUTRAL,
        strokeStyle: CHART_COLORS.BORDER,
        lineWidth: CHART_DEFAULTS.borderWidth,
        hidden: !chart.isDatasetVisible(index),
        datasetIndex: index,
    }))
}

const getLegendConfig = (chartType: ProjectDashboardChartComponentType, stacked?: boolean) => {
    return {
        position: chartType === 'doughnut' ? 'right' : 'top',
        labels: isStackedBar(chartType, stacked) ? { generateLabels: generateStackedBarLegendLabels } : undefined,
    }
}

const getScalesConfig = (chartType: ProjectDashboardChartComponentType, stacked?: boolean) => {
    if (!(chartType === 'bar')) return undefined

    const baseConfig = { y: { beginAtZero: true } }

    if (stacked) {
        return {
            x: { stacked: true },
            y: { ...baseConfig.y, stacked: true },
        }
    }

    return baseConfig
}

export const useProjectDashboardChart = <T extends ProjectDashboardChartComponentType>(
    props: ProjectDashboardChartProps,
) => {
    const { data, getData, loading } = useProjectDashboard<DashboardChartData>()

    const chartDataFormatted = computed(() => {
        const labels = data.value?.labels ?? []
        const rawDatasets = data.value?.datasets ?? []

        const datasets = isStackedBar(props.chartType, props.stacked)
            ? formatStackedBarDatasets(rawDatasets, getColorsByIndex(labels.length, CHART_COLORS.PALETTE))
            : formatDefaultDatasets(rawDatasets)

        return { labels, datasets } as ChartData<T>
    })

    const hasData = computed(() => {
        const chartData = data.value
        return Boolean(chartData?.labels?.length && chartData?.datasets?.length)
    })

    const baseChartOptions = computed(
        () =>
            ({
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: getLegendConfig(props.chartType, props.stacked),
                    title: {
                        display: true,
                        text: data.value?.title ?? '',
                    },
                },
                scales: getScalesConfig(props.chartType, props.stacked),
            }) as ChartOptions<T>,
    )

    const chartOptions = computed(() => {
        if (props.chartOptions) {
            return merge({}, [baseChartOptions.value, props.chartOptions]) as ChartOptions<T>
        }
        return baseChartOptions.value
    })

    return { getData, data, loading, chartDataFormatted, hasData, chartOptions }
}
