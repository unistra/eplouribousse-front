<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectResources } from '@/components/project/projectLaunched/useProjectResources.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { storeToRefs } from 'pinia'
import ProjectInstruction from '@/components/project/projectLaunched/projectInstruction/ProjectInstruction.vue'
import { ResourceStatus, Roles } from '&/project.ts'

const resourceStore = useResourceStore()
const { libraryIdSelected, libraryIdComparedSelected } = storeToRefs(useResourceStore())
const projectStore = useProjectStore()

const { tab, tabs, librariesOptions, table, librariesComparedOptions, selectDefaultLibrary, onRowClick } =
    useProjectResources()
const { t } = useI18n()

const fetchResources = () =>
    resourceStore.fetchResources({
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

onMounted(async () => {
    selectDefaultLibrary()
    await resourceStore.fetchResources({
        table,
        props: { pagination: table.pagination.value, filter: table.filter.value },
    })
})
</script>

<template>
    <div class="project-resources">
        <div class="header">
            <QSelect
                v-for="(select, index) in selects"
                :key="index"
                v-model="select.model.value"
                emit-value
                :label="select.label"
                map-options
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
                <ProjectTabPanel
                    v-for="(value, index) in tabs"
                    :key="index"
                    :tab-name="value.name"
                    @on-row-click="onRowClick"
                />
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
