```vue
<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore'
import ProjectDashboardTable from '@/components/project/projectDashboard/ProjectDashboardTable.vue'
import ProjectDashboardBarChart from '@/components/project/projectDashboard/ProjectDashboardBarChart.vue'
import ProjectDashboardDonutChart from '@/components/project/projectDashboard/ProjectDashboardDonutChart.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useProjectStore()
const userStore = useUserStore()
const { t } = useI18n()

watch(
    () => route.params.id,
    async () => {
        const id = route.params.id as string
        store.isLoading = true
        await store.fetchProjectById(id, true).then(() => userStore.fillProjectUser(store.roles))
        store.isLoading = false
    },
    { immediate: true },
)
</script>

<template>
    <QPage padding>
        <h1>{{ t('project.dashboard.Dashboard') }} : {{ store.name }}</h1>
        <div class="dashboard">
            <ProjectDashboardTable type="initial-data" />
            <ProjectDashboardTable type="positioning-information" />
            <ProjectDashboardTable type="exclusion-information" />
            <ProjectDashboardTable type="arbitration-information" />
            <ProjectDashboardTable type="instruction-candidates-information" />
            <ProjectDashboardTable type="instructions-information" />
            <ProjectDashboardTable type="controls-information" />
            <ProjectDashboardTable type="anomalies-information" />
            <ProjectDashboardTable type="achievements-information" />
            <ProjectDashboardBarChart type="realized-positioning-per-library" />
            <ProjectDashboardBarChart type="resources-to-instruct-per-library" />
            <ProjectDashboardBarChart type="collection-occurrences-per-library" />
            <ProjectDashboardDonutChart type="collection-occurrences-per-library" />
        </div>
    </QPage>
</template>

<style scoped lang="sass">
h1
    display: inline-flex
    flex-direction: row
    justify-content: center

.dashboard

    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1rem
</style>
