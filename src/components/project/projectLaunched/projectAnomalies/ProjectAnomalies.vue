<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
</script>

<template>
    <div class="anomalies">
        <ProjectSegmentTable />
    </div>
</template>

<style scoped lang="sass">
.anomalies
    display: flex
    flex-direction: column
    width: 100%
    gap: 2rem
</style>
