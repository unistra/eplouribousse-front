<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { ProjectAdministrationTab, } from '@/components/project/admin/useProjectAdmin.ts'
import ProjectAdminTabInformation from '@/components/project/admin/tabs/ProjectAdminTabInformation.vue'
import { useProjectView } from '@/components/project/useProjectView.ts'
import { useProjectAdmin } from '@/components/project/projectAdmin/useProjectAdmin.ts'
import { useRoute } from 'vue-router'

const projectStore = useProjectStore()
const route = useRoute()

const { tabs, tab } = useProjectAdmin()

const { watchRouteIdAndFetchProject } = useProjectView()
watchRouteIdAndFetchProject()
</script>

<template>
    <QPage padding>
        <h1>
            {{ route.meta.title }}:
            <span v-if="projectStore.isLoading">
                <QSkeleton type="text" />
            </span>
            <span v-else>{{ projectStore.name }}</span>
        </h1>
        <QTabs
            v-model="tab"
            align="left"
            dense
            no-caps
        >
            <QTab
                v-for="tab in tabs"
                :key="tab.name"
                :label="tab.label"
                :name="tab.name"
            >
            </QTab>
        </QTabs>
        <QTabPanels
            v-model="tab"
            animated
        >
            <QTabPanel
                v-for="tab in tabs"
                :key="tab.name"
                :name="tab.name"
            >
                <template v-if="tab.name === ProjectAdministrationTab.Informations">
                    <ProjectAdminTabInformation />
                </template>
                <template v-if="tab.name === ProjectAdministrationTab.Libraries"> </template>
            </QTabPanel>
        </QTabPanels>
    </QPage>
</template>

<style lang="sass" scoped>
h1
    display: inline-flex
    gap: 0.5rem

    .q-skeleton
        width: 16rem
</style>
