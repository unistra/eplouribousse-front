<script setup lang="ts">
import ProjectDashboardTable from '@/components/project/projectDashboard/ProjectDashboardTable.vue'
</script>

<template>
    <QPage padding>
        <ProjectDashboardTable type="initial-data" />
        <ProjectDashboardTable type="positioning-information" />
    </QPage>
</template>

<style scoped lang="sass">
main
    background-color: lightgrey
</style>
