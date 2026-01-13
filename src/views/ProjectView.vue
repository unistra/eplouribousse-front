<script lang="ts" setup>
import ProjectStepper from '@/components/project/stepper/ProjectStepper.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import ProjectReview from '@/components/project/projectReview/ProjectReview.vue'
import ProjectResources from '@/components/project/projectLaunched/ProjectResources.vue'
import { ProjectStatus } from '&/project.ts'
import ProjectSummary from '@/components/project/stepper/steps/summary/ProjectSummary.vue'
import { useProjectView } from '@/components/project/useProjectView.ts'

const projectStore = useProjectStore()
const { watchRouteIdAndFetchProject } = useProjectView()

watchRouteIdAndFetchProject()
</script>

<template>
    <QPage padding>
        <template v-if="!projectStore.projectLoading && projectStore.project">
            <ProjectStepper v-if="projectStore.project.status < ProjectStatus.Review" />
            <ProjectReview
                v-else-if="
                    projectStore.project.status < ProjectStatus.Ready ||
                    projectStore.project.status < ProjectStatus.Launched
                "
            />
            <ProjectSummary
                v-else-if="projectStore.project.status < ProjectStatus.Archived && !projectStore.project.isActive"
            />
            <ProjectResources v-else-if="projectStore.project.status < ProjectStatus.Archived" />
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
