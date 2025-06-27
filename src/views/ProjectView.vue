<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ProjectI } from '#/project'
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'
import { useProjectStore } from '@/stores/projectStore.ts'

const route = useRoute()
const id = route.params.id as string
const project = ref<ProjectI | null>(null)
const store = useProjectStore()

onMounted(async () => {
    if (id) await store.fetchProjectById(id)
})
</script>

<template>
    <main>
        <NewProjectStepper />
    </main>
</template>

<style scoped></style>
