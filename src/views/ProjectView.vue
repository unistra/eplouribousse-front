<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { ProjectI } from '#/project'
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'
import { useProjectStore } from '@/stores/projectStore.ts'

const route = useRoute()
const id = route.params.id as string
const project = ref<ProjectI | null>(null)
const store = useProjectStore()

watch(
    () => route.params.id,
    async () => {
        const id = route.params.id as string

        store.isLoading = true
        await store.fetchProjectById(id)
        store.isLoading = false
    },
    { immediate: true },
)
</script>

<template>
    <QPage padding>
        <NewProjectStepper v-if="!store.isLoading" />
        <QSpinner
            v-else
            size="4rem"
        />
    </main>
    </QPage>
</template>

<style lang="scss" scoped>
.q-spinner {
    width: 100%;
}
</style>
