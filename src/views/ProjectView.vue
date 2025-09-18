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
import ProjectAdministration from '@/components/project/projectSettings/ProjectAdministration.vue'

const route = useRoute()
const store = useProjectStore()
const userStore = useUserStore()
const { isInEditionMode } = storeToRefs(store)
const { userInProject } = storeToRefs(userStore)

watch(
    () => route.params.id,
    async () => {
        const id = route.params.id as string

        store.isLoading = true
        await store.fetchProjectById(id).then(() => userStore.fillProjectUser(store.roles))
        store.isLoading = false
    },
    { immediate: true },
)

watch(
    userInProject,
    () => {
        if (userInProject.value === undefined) {
            userStore.fillProjectUser(store.roles)
        }
    },
    { immediate: true },
)
</script>

<template>
    <QPage padding>
        <template v-if="!store.isLoading">
            <ProjectStepper v-if="store.status < ProjectStatus.Review" />
            <ProjectReview v-else-if="store.status < ProjectStatus.Ready || store.status < ProjectStatus.Launched" />
            <ProjectResources v-else-if="store.status < ProjectStatus.Archived" />
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
