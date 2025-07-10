<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import ProjectReview from '@/components/project/projectReview/ProjectReview.vue'

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
        <template v-if="!store.isLoading">
            <NewProjectStepper v-if="store.status < 20" />
            <ProjectReview v-else-if="store.status < 30" />
        </template>
        <QSpinner
            v-else
            size="4rem"
        />
    </QPage>
</template>

<style lang="sass" scoped>
.q-spinner
    width: 100%

.q-page
    display: flex
</style>
