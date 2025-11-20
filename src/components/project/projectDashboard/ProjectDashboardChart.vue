<script setup lang="ts">
import {
    type ProjectDashboardChartType,
    useProjectDashboard,
} from '@/components/project/projectDashboard/useProjectDashboard.ts'
import GenericChart from '@/components/project/projectDashboard/GenericChart.vue'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'
import type { ChartData, ChartOptions } from 'chart.js'

type ChartDataset = {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
}

type DashboardChartData = {
    title: string
    labels: string[]
    datasets: ChartDataset[]
    computedAt: string
}

const props = defineProps<{
    type: ProjectDashboardChartType
    chartType: 'bar' | 'line' | 'pie' | 'doughnut'
    stacked?: boolean
}>()

const { t } = useI18n()
const utils = useUtils()
const { data: chartData, getData, loading } = useProjectDashboard<DashboardChartData>()

const chartDataFormatted = computed<ChartData<typeof props.chartType>>(() => {
    const palette = [
        '#76af8f', // vert
        '#f3c260', // jaune
        '#888fc2', // bleu
        '#e38a77', // rouge
        '#9b59b6', // violet
        '#3498db', // bleu clair
        '#e74c3c', // rouge vif
        '#1abc9c', // turquoise
        '#f39c12', // orange
        '#34495e', // gris bleu
    ]

    const datasets = (chartData.value?.datasets || []).map((dataset) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || palette,
        borderColor: dataset.borderColor || '#ffffff',
        borderWidth: dataset.borderWidth || 2,
    }))

    return {
        labels: chartData.value?.labels || [],
        datasets,
    }
})

const hasData = computed(
    () =>
        !!chartData.value &&
        Array.isArray(chartData.value.labels) &&
        chartData.value.labels.length > 0 &&
        Array.isArray(chartData.value.datasets) &&
        chartData.value.datasets.length > 0,
)

const chartOptions = computed<ChartOptions>(() => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            position: props.chartType === 'doughnut' || props.chartType === 'pie' ? 'right' : 'top',
        },
        title: {
            display: true,
            text: chartData.value?.title || '',
        },
    },
    scales:
        props.chartType === 'bar' && props.stacked
            ? {
                  x: {
                      stacked: true,
                  },
                  y: {
                      stacked: true,
                      beginAtZero: true,
                  },
              }
            : props.chartType === 'bar'
              ? {
                    y: {
                        beginAtZero: true,
                    },
                }
              : undefined,
}))

onMounted(async () => {
    await getData(props.type)
})
</script>

<template>
    <div>
        <QSkeleton
            v-if="loading"
            height="400px"
            type="rect"
        />
        <GenericChart
            v-else-if="hasData"
            :chart-data="chartDataFormatted"
            :chart-options="chartOptions"
            :type="chartType"
        />
        <p v-else>{{ t('errors.dataUnreachable') }}</p>

        <p
            v-if="chartData?.computedAt"
            class="computed-at"
        >
            <QIcon
                name="mdi-cached"
                size="1.25rem"
            />
            {{ t('project.dashboard.computedAt') }}
            {{ utils.useIntlDateTimeFormat(chartData.computedAt) }}
        </p>
    </div>
</template>

<style scoped lang="sass">

.chart-container
  min-height: 300px
  max-height: 500px
.computed-at

  font-size: 0.75rem
  color: grey
  font-style: italic
  margin-top: 0.5rem
  text-align: right
</style>
