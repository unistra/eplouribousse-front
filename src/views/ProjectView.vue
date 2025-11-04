<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import ProjectStepper from '@/components/project/projectStepper/ProjectStepper.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import ProjectReview from '@/components/project/projectReview/ProjectReview.vue'
import ProjectResources from '@/components/project/projectLaunched/ProjectResources.vue'
import { ProjectStatus } from '&/project.ts'
import ProjectSummary from '@/components/project/projectStepper/steps/projectSummary/ProjectSummary.vue'

const route = useRoute()
const projectStore = useProjectStore()
const userStore = useUserStore()
const { userInProject } = storeToRefs(userStore)

watch(
    () => route.params.id,
    async () => {
        const id = route.params.id as string

        projectStore.isLoading = true
        await projectStore.fetchProjectById(id).then(() => userStore.fillProjectUser(projectStore.roles))
        projectStore.isLoading = false
    },
    { immediate: true },
)

watch(
    userInProject,
    () => {
        if (userInProject.value === undefined) {
            userStore.fillProjectUser(projectStore.roles)
        }
    },
    { immediate: true },
)
</script>

<template>
    <QPage padding>
        <template v-if="!projectStore.isLoading">
            <ProjectStepper v-if="projectStore.status < ProjectStatus.Review" />
            <ProjectReview
                v-else-if="projectStore.status < ProjectStatus.Ready || projectStore.status < ProjectStatus.Launched"
            />
            <ProjectSummary v-else-if="projectStore.status < ProjectStatus.Archived && !projectStore.isActive" />
            <ProjectResources v-else-if="projectStore.status < ProjectStatus.Archived" />
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
