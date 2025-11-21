<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore.ts'
import ProjectDashboardTable from '@/components/project/projectDashboard/ProjectDashboardTable.vue'
import ProjectDashboardChart from '@/components/project/projectDashboard/ProjectDashboardChart.vue'
import { useProjectView } from '@/components/project/useProjectView.ts'
import { useProjectDashboard } from '@/components/project/projectDashboard/useProjectDashboard.ts'
import { useRoute } from 'vue-router'

const projectStore = useProjectStore()
const route = useRoute()
const { chartToDisplay, tableToDisplay } = useProjectDashboard()

const { watchRouteIdAndFetchProject } = useProjectView()
watchRouteIdAndFetchProject()
</script>

<template>
    <QPage padding>
        <h1>{{ route.meta.title }}: {{ projectStore.name }}</h1>
        <div class="dashboard">
            <div class="table">
                <ProjectDashboardTable
                    v-for="el in tableToDisplay"
                    :key="el"
                    :type="el"
                />
            </div>
            <div class="chart">
                <ProjectDashboardChart
                    v-for="el in chartToDisplay"
                    :key="el.type"
                    :chart-type="el.chartType"
                    :stacked="el.stacked"
                    :type="el.type"
                />
            </div>
        </div>
    </QPage>
</template>

<style scoped lang="sass">
.dashboard
    display: flex
    flex-direction: column
    gap: 2rem

    .table, .chart
        display: flex
        gap: 1rem
        flex-wrap: wrap
        justify-content: space-evenly
</style>
