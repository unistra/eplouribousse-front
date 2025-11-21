<script setup lang="ts">
import { type Component, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    type ChartData,
    type ChartOptions,
} from 'chart.js'
import type { ProjectDashboardChartComponentType } from '@/components/project/projectDashboard/useProjectDashboard.ts'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

const props = defineProps<{
    type: ProjectDashboardChartComponentType
    chartData: ChartData<ProjectDashboardChartComponentType>
    chartOptions?: ChartOptions<ProjectDashboardChartComponentType>
}>()

const chartMap: Record<ProjectDashboardChartComponentType, Component> = {
    bar: Bar,
    doughnut: Doughnut,
}

const chartComponent = computed(() => chartMap[props.type])
</script>

<template>
    <component
        :is="chartComponent"
        :data="chartData"
        :options="chartOptions"
    />
</template>
