<script setup lang="ts">
import { type Component, computed } from 'vue'
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs'
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
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut'

const props = defineProps<{
    type: ChartType
    chartData: ChartData<ChartType>
    chartOptions?: ChartOptions
}>()

const chartMap: Record<ChartType, Component> = {
    bar: Bar,
    line: Line,
    pie: Pie,
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
