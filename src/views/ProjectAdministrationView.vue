<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import {
    ProjectAdministrationTab,
    useProjectAdminTabExclusions,
} from '@/components/project/admin/tabs/exclusions/useProjectAdminTabExclusions.ts'
import ProjectAdminTabInformation from '@/components/project/admin/tabs/ProjectAdminTabInformation.vue'
import { useProjectView } from '@/components/project/useProjectView.ts'
import { useRoute } from 'vue-router'
import ProjectLibraryCard from '@/components/project/libraries/card/ProjectLibraryCard.vue'
import ProjectRoles from '@/components/project/stepper/steps/roles/ProjectRoles.vue'
import ProjectAdminTabAlerts from '@/components/project/admin/tabs/ProjectAdminTabAlerts.vue'
import ProjectAdminTabExclusions from '@/components/project/admin/tabs/exclusions/ProjectAdminTabExclusions.vue'

const projectStore = useProjectStore()
const route = useRoute()


const { watchRouteIdAndFetchProject } = useProjectView()
watchRouteIdAndFetchProject()
const { tabs, tab } = useProjectAdminTabExclusions()
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
            />
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
                <template v-if="tab.name === ProjectAdministrationTab.Libraries">
                    <div class="libraries">
                        <ProjectLibraryCard
                            v-for="library in projectStore.libraries"
                            :key="library.id"
                            :library="library"
                            :summary-mode="!projectStore.userIsAdmin"
                        />
                    </div>
                </template>
                <template v-if="tab.name === ProjectAdministrationTab.Users">
                    <ProjectRoles setting-mode />
                </template>
                <template v-if="tab.name === ProjectAdministrationTab.Alerts">
                    <ProjectAdminTabAlerts />
                </template>
                <template v-if="tab.name === ProjectAdministrationTab.Exclusions">
                    <ProjectAdminTabExclusions />
                </template>
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

.libraries
    display: flex
    gap: 1rem
</style>
