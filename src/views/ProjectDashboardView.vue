<script setup lang="ts">
import ProjectDashboardTable from '@/components/project/projectDashboard/ProjectDashboardTable.vue'
</script>

<template>
    <QPage padding>
        <ProjectDashboardTable type="initial-data" />
        <ProjectDashboardTable type="positioning-information" />
        <ProjectDashboardTable type="exclusion-information" />
        <ProjectDashboardTable type="arbitration-information" />
        <ProjectDashboardTable type="instruction-candidates-information" />
        <ProjectDashboardTable type="instructions-information" />
        <ProjectDashboardTable type="controls-information" />
        <ProjectDashboardTable type="anomalies-information" />
        <ProjectDashboardTable type="achievements-information" />
    </QPage>
</template>

<style scoped lang="sass">
main
    background-color: var(--color-neutral-100)
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1rem
</style>
