=
<script setup lang="ts">
import { useProjectAdmin } from './useProjectAdmin.ts'
import ProjectAdmin from './ProjectAdminDispatcher.vue'
const { tabs, tab } = useProjectAdmin()
</script>

<template>
    <div>
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
    </div>
    <div>
        <QTabPanels
            v-model="tab"
            animated
        >
            <QTabPanel
                v-for="tab in tabs"
                :key="tab.name"
                :name="tab.name"
            >
                <ProjectAdmin :tab-name="tab.name" />
            </QTabPanel>
        </QTabPanels>
    </div>
</template>

<style lang="sass" scoped>
.tab
    font-size: 20px
    font-weight: 600

.email-alerts, .storage, .exclusions
    display: flex
    flex-direction: column

.exclusions
    .q-list
        .q-item
            display: flex
            align-items: center
            gap: 1rem
            .q-btn
                width: fit-content
</style>
