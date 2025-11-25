<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectResources } from '@/components/project/projectLaunched/useProjectResources.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Roles, Tab } from '&/project.ts'
import type { QTable } from 'quasar'
import ProjectResource from '@/components/project/projectLaunched/ProjectResource/ProjectResource.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useRoute } from 'vue-router'

const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const route = useRoute()

const {
    tabs,
    resourceDialog,
    table,
    selectDefaultLibrary,
    onRowClick,
    fetchResources,
    selects,
    disableLibrarySelectedSelect,
    computeStatusInfos,
    selectFilterOnPositioning,
    positioningFilter,
} = useProjectResources()
const { t } = useI18n()

onMounted(async () => {
    selectDefaultLibrary()
    await fetchResources()
    if (route.query.resourceId) {
        resourceStore.resourceSelectedId = route.query.resourceId as string
        resourceDialog.value = true
    }
})
</script>

<template>
    <div class="project-resources">
        <div class="hgroup">
            <h1>{{ projectStore.name }}</h1>
            <div>
                <AtomicButton
                    dense
                    flat
                    icon="mdi-chart-bar"
                    round
                    :to="{ name: 'projectDashboard' }"
                />
                <AtomicButton
                    v-if="projectStore.userIsAdmin"
                    dense
                    flat
                    icon="mdi-cog"
                    round
                    :to="{ name: 'projectAdmin' }"
                />
            </div>
        </div>
        <div class="selects">
            <AtomicSelect
                v-for="(select, index) in selects"
                :key="index"
                v-model="select.model.value"
                color="primary"
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
                inline-label
                no-caps
                @update:model-value="fetchResources(undefined, true)"
            >
                <QTab
                    v-for="(value, index) in tabs"
                    :key="index"
                    :icon="value.icon"
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
                <AtomicSelect
                    v-if="projectStore.tab === Tab.Positioning"
                    v-model="positioningFilter"
                    class="filter-positioning"
                    dense
                    :disable="disableLibrarySelectedSelect"
                    emit-value
                    :label="t('project.positioning.filter.i')"
                    map-options
                    name="filter-positioning"
                    option-label="label"
                    option-value="value"
                    :options="selectFilterOnPositioning"
                    @update:model-value="fetchResources(undefined, false)"
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

                    <template #body-cell-status="props">
                        <QTd>
                            <QChip
                                class="status"
                                :color="computeStatusInfos(props.row).color"
                                :icon="computeStatusInfos(props.row).icon"
                                size="0.8rem"
                                :text-color="!computeStatusInfos(props.row).color ? undefined : 'white'"
                            >
                                {{ computeStatusInfos(props.row).message }}
                            </QChip>
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
    gap: 1rem

    .hgroup
        display: flex
        align-items: center
        justify-content: space-between

    .selects
        display: flex
        gap: 1rem
        align-items: center

        .q-select
            width: 100%
            max-width: 300px


    .q-list
        width: 100%


.title-qtd
    .title-p
        white-space: wrap

.filter-positioning
    width: 100%
    max-width: 300px
</style>
