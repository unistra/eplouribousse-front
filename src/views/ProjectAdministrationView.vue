<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore'
import ProjectAdmin from '@/components/project/projectAdmin/ProjectAdmin.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useProjectStore()
const userStore = useUserStore()
const { t } = useI18n()

watch(
    () => route.params.id,
    async () => {
        const id = route.params.id as string

        store.isLoading = true
        await store.fetchProjectById(id, true).then(() => userStore.fillProjectUser(store.roles))
        store.isLoading = false
    },
    { immediate: true },
)
</script>

<template>
    <QPage padding>
        <h1 class="heading">{{ t('project.administration.title') }} : {{ store.name }}</h1>
        <template v-if="!store.isLoading">
            <ProjectAdmin />
        </template>
        <QSpinner
            v-else
            size="4rem"
        />
    </QPage>
</template>

<style lang="sass" scoped>
.heading
    display: flex
    flex-direction: row
    justify-content: center
    font-size: var(--font-size-3xl)
</style>
