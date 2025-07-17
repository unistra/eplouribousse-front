<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import ProjectReview from '@/components/project/projectReview/ProjectReview.vue'

const route = useRoute()
const store = useProjectStore()
const userStore = useUserStore()
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
