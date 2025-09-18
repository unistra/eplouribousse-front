<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore'
import ProjectAdministration from '@/components/project/projectSettings/ProjectAdministration.vue'
import { QBtn } from 'quasar'

const route = useRoute()
const store = useProjectStore()
const userStore = useUserStore()

// watch(
//     () => route.params.id,
//     async () => {
//         const id = route.params.id as string

//         store.isLoading = true
//         await store.fetchProjectById(id).then(() => userStore.fillProjectUser(store.roles))
//         store.isLoading = false
//     },
//     { immediate: true },
// )

onMounted(async () => {
    // const store = useProjectStore()
    // const userStore = useUserStore()
    const id = route.params.id as string
    console.log(id)

    store.isLoading = true
    await store.fetchProjectById(id).then(() => userStore.fillProjectUser(store.roles))
    store.isLoading = false
})
</script>

<template>
    <QPage padding>
        <template v-if="!store.isLoading">
            <h2>TRALALA</h2>
            <ProjectAdministration />
        </template>
        <QSpinner
            v-else
            size="4rem"
        />
    </QPage>
</template>

<style lang="sass" scoped></style>
