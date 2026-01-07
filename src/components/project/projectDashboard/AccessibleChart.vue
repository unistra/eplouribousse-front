<script setup lang="ts">
import { computed } from 'vue'
import GenericChart from '@/components/project/projectDashboard/GenericChart.vue'
import type { ChartData, ChartOptions } from 'chart.js'
import type { ProjectDashboardChartComponentType } from '@/components/project/projectDashboard/useProjectDashboard.ts'

const props = defineProps<{
    type: ProjectDashboardChartComponentType
    chartData: ChartData<ProjectDashboardChartComponentType>
    chartOptions?: ChartOptions<ProjectDashboardChartComponentType>
    title: string
}>()

// Generated unique ID for aria-describedby relation
const descriptionId = computed(() => `chart-desc-${crypto.randomUUID()}`)
</script>

<template>
    <div class="accessible-chart-wrapper">
        <!-- the graph hidden to SR -->
        <div
            :aria-describedby="descriptionId"
            :aria-label="title"
            class="chart-container"
        >
            <GenericChart
                aria-hidden="true"
                :chart-data="props.chartData"
                :chart-options="props.chartOptions"
                :type="props.type"
            />
        </div>

        <!-- Alternative table for SR (not visually visible) -->
        <table
            :id="descriptionId"
            class="sr-only"
        >
            <caption>
                {{
                    title
                }}
            </caption>
            <thead>
                <tr>
                    <th scope="col">Label</th>
                    <th
                        v-for="(dataset, datasetIndex) in props.chartData.datasets"
                        :key="`dataset-${datasetIndex}`"
                        scope="col"
                    >
                        {{ dataset.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(label, labelIndex) in props.chartData.labels"
                    :key="`label-${labelIndex}`"
                >
                    <th scope="row">{{ label }}</th>
                    <td
                        v-for="(dataset, datasetIndex) in props.chartData.datasets"
                        :key="`cell-${labelIndex}-${datasetIndex}`"
                    >
                        {{ (dataset.data as number[])[labelIndex] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="sass">
.accessible-chart-wrapper
  display: flex
  flex-direction: column
  gap: 0.5rem

.chart-container
  outline: none
  &:focus
    outline: 2px solid var(--color-focus, #4a90e2)
    outline-offset: 2px

.sr-only
  position: absolute
  width: 1px
  height: 1px
  padding: 0
  margin: -1px
  overflow: hidden
  clip: rect(0, 0, 0, 0)
  white-space: nowrap
  border: 0
</style>
