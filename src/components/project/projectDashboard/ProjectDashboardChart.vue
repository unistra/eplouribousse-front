<script setup lang="ts">
import GenericChart from '@/components/project/projectDashboard/GenericChart.vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'
import {
    type ProjectDashboardChartProps,
    useProjectDashboardChart,
} from '@/components/project/projectDashboard/useProjectDashboardChart.ts'
import ProjectDashboardErrorCard from '@/components/project/projectDashboard/ProjectDashboardErrorCard.vue'

const props = defineProps<ProjectDashboardChartProps>()

const { t } = useI18n()
const utils = useUtils()

const { data, getData, loading, chartDataFormatted, hasData, chartOptions } = useProjectDashboardChart(props)

onMounted(async () => {
    await getData(props.type)
})
</script>

<template>
    <div v-if="loading || hasData">
        <QSkeleton
            v-if="loading"
            type="rect"
        />
        <GenericChart
            v-else
            :chart-data="chartDataFormatted"
            :chart-options="chartOptions"
            class="chart"
            :type="props.chartType"
        />

        <p
            v-if="data?.computedAt"
            class="computed-at"
        >
            <QIcon
                name="mdi-cached"
                size="1.25rem"
            />
            {{ t('view.project.dashboard.computedAt') }}
            {{ utils.useIntlDateTimeFormat(data.computedAt) }}
        </p>
    </div>
    <ProjectDashboardErrorCard v-else />
</template>

<style scoped lang="sass">
.q-skeleton, .chart
    width: 24rem
    height: 24rem

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
