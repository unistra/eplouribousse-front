<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
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
        <div
            v-else
            class="spinner"
        >
            <QSpinner size="4rem" />
        </div>
    </QPage>
</template>

<style lang="scss" scoped>
.q-page {
    position: relative;
}

.spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
