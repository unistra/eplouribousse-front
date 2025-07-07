<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'
import { useProjectStore } from '@/stores/projectStore.ts'

const route = useRoute()
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
    </QPage>
</template>

<style lang="scss" scoped>
.q-spinner {
    width: 100%;
}
</style>
