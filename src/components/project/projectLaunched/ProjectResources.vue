<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { onMounted } from 'vue'
import { useProjectResources } from '@/components/project/projectLaunched/useProjectResources.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import ProjectInstruction from '@/components/project/projectLaunched/projectInstruction/ProjectInstruction.vue'
import ProjectPositioning from '@/components/project/projectLaunched/projectPositioning/ProjectPositioning.vue'
import { ResourceStatus, Roles } from '&/project.ts'
import type { QTable } from 'quasar'

const resourceStore = useResourceStore()
const projectStore = useProjectStore()

const {
    tab,
    tabs,
    tabStatus,
    librariesOptions,
    resourceDialog,
    resourceIdSelected,
    table,
    librariesComparedOptions,
    selectDefaultLibrary,
    onRowClick,
} = useProjectResources()
const { t } = useI18n()

const fetchResources = () =>
    resourceStore.fetchResources(tabStatus.value, {
        table,
        props: { pagination: table.pagination.value, filter: table.filter.value },
    })

const selects = [
    {
        model: libraryIdSelected,
        label: t('project.resources.showResources'),
        options: librariesOptions.value,
        callback: fetchResources,
    },
    {
        model: libraryIdComparedSelected,
        label: t('project.resources.compareWith'),
        options: librariesComparedOptions.value,
        callback: fetchResources,
    },
]

async function reloadResources() {
    await resourceStore.fetchResources(tabStatus.value, {
        table,
        props: { pagination: table.pagination.value, filter: table.filter.value },
    })
}

onMounted(async () => {
    selectDefaultLibrary()
    await resourceStore.fetchResources(ResourceStatus.Positioning, {
        table,
        props: { pagination: table.pagination.value, filter: table.filter.value },
    })
})
</script>

<template>
    <div class="project-resources">
        <div>
            <QSelect
                v-for="(select, index) in selects"
                :key="index"
                v-model="select.model.value"
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
                v-model="tab"
                align="left"
                dense
                no-caps
                @update:model-value="reloadResources()"
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
                        @request="table.onRequest"
                        @row-click="onRowClick"
                    >
                        <template #top-right>
                            <QInput
                                v-model="table.filter.value"
                                debounce="3000"
                                dense
                                :placeholder="t('common.search')"
                            >
                                <template v-slot:append>
                                    <QIcon name="mdi-magnify" />
                                </template>
                            </QInput>
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
                    <QDialog
                        v-model="resourceDialog"
                        class="dialog"
                        full-height
                        full-width
                    >
                        <QCard>
                            <QCardActions>
                                <AtomicButton
                                    icon="mdi-arrow-left"
                                    no-border
                                    @click="resourceDialog = false"
                                />
                            </QCardActions>
                            <QCardSection>
                                <ProjectPositioning
                                    v-if="resourceStore.status === ResourceStatus.Positioning"
                                    :resource-id="resourceIdSelected"
                                />
                                <ProjectInstruction
                                    v-else-if="resourceIdSelected"
                                    :resource-id="resourceIdSelected"
                                />
                                <p v-else>{{ t('errors.unknown') }}</p>
                            </QCardSection>
                        </QCard>
                    </QDialog>
                </QTabPanel>
            </QTabPanels>
        </div>
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
