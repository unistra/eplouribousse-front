<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import ProjectsTable from '@/components/projects/ProjectsTable.vue'

const route = useRoute()
const router = useRouter()
</script>

<template>
    <QPage padding>
        <h1>{{ route.meta.title }}</h1>
        <ProjectsTable @row-click="(row) => router.push({ name: 'project', params: { id: row.id } })" />
    </QPage>
</template>

<style lang="sass" scoped>
main
    display: flex
    flex-direction: column
    gap: 2rem
</style>
