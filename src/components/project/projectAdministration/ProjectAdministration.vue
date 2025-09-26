<script setup lang="ts">
import { useProjectAdministration } from './useProjectAdministration'
import ProjectAdministrationDispatcher from './ProjectAdministrationDispatcher.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useProjectStore } from '@/stores/projectStore'

const { tabs, tab } = useProjectAdministration()
const store = useProjectStore()
</script>

<template>
    <div>
        <QTabs
            v-model="tab"
            align="left"
            dense
            no-caps
            @update:model-value="console.log('changement de tab')"
        >
            <QTab
                v-for="(value, index) in tabs"
                :key="index"
                :label="value.label"
                :name="value.name"
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
                v-for="(value, index) in tabs"
                :key="index"
                :name="value.name"
            >
                <ProjectAdministrationDispatcher :tab-name="value.name" />
            </QTabPanel>
        </QTabPanels>
        <AtomicButton
            label="Enregister"
            :loading="store.isLoading"
            @click="store.updateProject"
        />
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
