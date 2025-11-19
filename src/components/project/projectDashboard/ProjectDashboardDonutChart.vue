<script setup lang="ts">
import {
    type ProjectDashboardChartType,
    useProjectDashboard,
} from '@/components/project/projectDashboard/useProjectDashboard.ts'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'

type ChartDataset = {
    label: string
    data: number[]
    backgroundColor?: string[]
}

type DashboardChartData = {
    title: string
    labels: string[]
    datasets: ChartDataset[]
    computedAt: string
}

ChartJS.register(ArcElement, Title, Tooltip, Legend)

const props = defineProps<{
    type: ProjectDashboardChartType
}>()

const { t } = useI18n()
const utils = useUtils()
const { data: chartData, getData, loading } = useProjectDashboard<DashboardChartData>()

const data = computed(() => ({
    labels: chartData.value?.labels || [],
    datasets: chartData.value?.datasets || [],
}))

const hasData = computed(
    () =>
        !!chartData.value &&
        Array.isArray(chartData.value.labels) &&
        chartData.value.labels.length > 0 &&
        Array.isArray(chartData.value.datasets) &&
        chartData.value.datasets.length > 0,
)

const options = computed(() => ({
    responsive: true,
    plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: chartData.value?.title || '' },
    },
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
        <Doughnut
            v-else-if="hasData"
            :data="data"
            :options="options"
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

.computed-at
    font-size: 0.75rem
    color: grey
    font-style: italic
    margin-top: 0.5rem
    text-align: right
</style>
