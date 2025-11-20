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
        '#76af8f',
        '#f3c260',
        '#888fc2',
        '#e38a77',
        '#9b59b6',
        '#3498db',
        '#e74c3c',
        '#1abc9c',
        '#f39c12',
        '#34495e',
    ]
    const labels = chartData.value?.labels || []
    const rawDatasets = chartData.value?.datasets || []
    let datasets

    if (props.chartType === 'bar' && props.stacked) {
        const baseColors = labels.map((_, idx) => palette[idx % palette.length])

        // Fonction pour créer un motif de hachures
        const createHatchPattern = (color: string) => {
            // Crée un canvas en mémoire pour dessiner le motif
            const patternCanvas = document.createElement('canvas')
            const patternContext = patternCanvas.getContext('2d')
            if (!patternContext) return color // Fallback

            const size = 10
            patternCanvas.width = size
            patternCanvas.height = size

            // Fond de la couleur de base
            patternContext.fillStyle = color
            patternContext.fillRect(0, 0, size, size)

            // Lignes de hachure
            patternContext.strokeStyle = 'rgba(0, 0, 0, 0.2)'
            patternContext.lineWidth = 2
            patternContext.beginPath()
            patternContext.moveTo(0, size)
            patternContext.lineTo(size, 0)
            patternContext.stroke()

            // Crée le motif répétable
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return color // Fallback
            return ctx.createPattern(patternCanvas, 'repeat') ?? color
        }

        datasets = rawDatasets.map((dataset, i) => {
            const backgroundColor =
                i === 1
                    ? baseColors.map((color) => createHatchPattern(color)) // Applique les hachures au 2ème dataset
                    : baseColors // Couleurs pleines pour le 1er dataset

            return {
                ...dataset,
                backgroundColor,
                borderColor: '#ffffff',
                borderWidth: 2,
            }
        })
    } else {
        // Logique originale pour tous les autres graphiques
        datasets = rawDatasets.map((dataset) => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || palette,
            borderColor: dataset.borderColor || '#ffffff',
            borderWidth: dataset.borderWidth || 2,
        }))
    }

    return {
        labels,
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
            // Personnalisation de la légende pour les graphiques à barres empilées
            labels:
                props.chartType === 'bar' && props.stacked
                    ? {
                          generateLabels: (chart) => {
                              const datasets = chart.data.datasets
                              const neutralColor = '#C0C0C0' // Une couleur grise neutre

                              // Fonction pour créer un motif de hachures (doit être accessible ici)
                              const createHatchPattern = (color: string) => {
                                  const patternCanvas = document.createElement('canvas')
                                  const patternContext = patternCanvas.getContext('2d')
                                  if (!patternContext) return color
                                  const size = 10
                                  patternCanvas.width = size
                                  patternCanvas.height = size
                                  patternContext.fillStyle = color
                                  patternContext.fillRect(0, 0, size, size)
                                  patternContext.strokeStyle = 'rgba(0, 0, 0, 0.2)'
                                  patternContext.lineWidth = 2
                                  patternContext.beginPath()
                                  patternContext.moveTo(0, size)
                                  patternContext.lineTo(size, 0)
                                  patternContext.stroke()
                                  const canvas = document.createElement('canvas')
                                  const ctx = canvas.getContext('2d')
                                  if (!ctx) return color
                                  return ctx.createPattern(patternCanvas, 'repeat') ?? color
                              }

                              return datasets.map((ds, i) => ({
                                  text: ds.label || '',
                                  fillStyle: i === 1 ? createHatchPattern(neutralColor) : neutralColor,
                                  strokeStyle: '#ffffff',
                                  lineWidth: 2,
                                  hidden: !chart.isDatasetVisible(i),
                                  datasetIndex: i,
                              }))
                          },
                      }
                    : undefined, // Utilise la légende par défaut pour les autres graphiques
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
