<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectResources } from '@/components/project/projectLaunched/useProjectResources.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { ResourceStatus, Roles, Tab } from '&/project.ts'
import type { QTable } from 'quasar'
import ProjectResource from '@/components/project/projectLaunched/ProjectResource/ProjectResource.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const resourceStore = useResourceStore()
const projectStore = useProjectStore()

const {
    tabs,
    resourceDialog,
    table,
    selectDefaultLibrary,
    onRowClick,
    fetchResources,
    selects,
    toggleAnomaliesTypes,
    disableLibrarySelectedSelect,
    toggleControlTypes,
} = useProjectResources()
const { t } = useI18n()

onMounted(async () => {
    selectDefaultLibrary()
    await fetchResources()
})
</script>

<template>
    <div class="project-resources">
        <div>
            <QSelect
                v-for="(select, index) in selects"
                :key="index"
                v-model="select.model.value"
                :disable="disableLibrarySelectedSelect"
                emit-value
                :label="select.label"
                map-options
                :name="select.name"
                :option-label="
                    (el) =>
                        `${el.name}${projectStore.isRole(Roles.Instructor, el.id) ? ' - ' + t('project.resources.youAreInstructor') : ''}`
                "
                option-value="id"
                :options="select.options"
                @update:model-value="select.callback"
            />
        </div>
        <div>
            <QTabs
                v-model="projectStore.tab"
                align="left"
                dense
                no-caps
                @update:model-value="fetchResources(undefined, true)"
            >
                <QTab
                    v-for="(value, index) in tabs"
                    :key="index"
                    :label="value.label"
                    :name="value.name"
                />
            </QTabs>
        </div>
        <QTabPanels
            v-model="projectStore.tab"
            animated
        >
            <QTabPanel
                v-for="(value, index) in tabs"
                :key="index"
                :name="value.name"
            >
                <QToggle
                    v-if="projectStore.tab === Tab.Anomalies"
                    v-model="toggleAnomaliesTypes"
                    :false-value="ResourceStatus.AnomalyBound"
                    :label="
                        toggleAnomaliesTypes === ResourceStatus.AnomalyBound
                            ? t('project.resources.status.anomaliesBound')
                            : t('project.resources.status.anomaliesUnbound')
                    "
                    name="anomaly-toggle"
                    :true-value="ResourceStatus.AnomalyUnbound"
                    @update:model-value="fetchResources(undefined, true)"
                />
                <QToggle
                    v-if="projectStore.tab === Tab.Control"
                    v-model="toggleControlTypes"
                    :false-value="ResourceStatus.ControlBound"
                    :label="
                        toggleControlTypes === ResourceStatus.ControlBound
                            ? t('project.resources.status.controlBound')
                            : t('project.resources.status.controlUnbound')
                    "
                    name="control-toggle"
                    :true-value="ResourceStatus.ControlUnbound"
                    @update:model-value="fetchResources(undefined, true)"
                />
                <QTable
                    ref="qTable"
                    v-model:pagination="table.pagination.value"
                    binary-state-sort
                    :columns="table.columns as QTable['columns']"
                    :filter="table.filter"
                    flat
                    :loading="table.loading.value"
                    row-key="id"
                    :rows="resourceStore.getAll(table)"
                    :rows-per-page-options="[5, 10, 20, 50, 100]"
                    @request="fetchResources"
                    @row-click="onRowClick"
                >
                    <template #top-right>
                        <AtomicInput
                            v-model="table.filter.value"
                            clearable
                            debounce="1500"
                            dense
                            :placeholder="t('common.search')"
                        >
                            <template v-slot:append>
                                <QIcon name="mdi-magnify" />
                            </template>
                        </AtomicInput>
                    </template>

                    <template v-slot:body-cell-title="props">
                        <QTd
                            :auto-width="false"
                            class="title-qtd"
                            :props="props"
                        >
                            <p class="title-p">{{ props.row.title }}</p>
                        </QTd>
                    </template>
                </QTable>
                <ProjectResource v-model="resourceDialog" />
            </QTabPanel>
        </QTabPanels>
    </div>
</template>

<style scoped lang="sass">
.dialog
    .q-card
        display: flex
        flex-direction: column

        .q-card__section
            flex-grow: 1
            display: flex
            flex-direction: column

            .spinner
                display: flex
                align-items: center
                justify-content: center
                height: 100%

.project-resources
    display: flex
    flex-direction: column
    width: 100%


    .q-list
        width: 100%


.title-qtd
    .title-p
        white-space: wrap
</style>
