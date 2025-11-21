<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import ProjectAdmin from '@/components/project/projectAdmin/ProjectAdmin.vue'
import { useI18n } from 'vue-i18n'
import { useProjectView } from '@/components/project/useProjectView.ts'

const store = useProjectStore()
const { t } = useI18n()

const { watchRouteIdAndFetchProject } = useProjectView()
watchRouteIdAndFetchProject()
</script>

<template>
    <QPage padding>
        <h1>{{ t('project.administration.title') }} : {{ store.name }}</h1>
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
h1
    display: inline-flex
    flex-direction: row
    justify-content: center
</style>
