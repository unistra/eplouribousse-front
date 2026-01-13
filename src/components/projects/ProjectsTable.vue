<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { type ProjectsTableProps, useProjectsTable } from '@/components/projects/useProjectsTable.ts'
import { useI18n } from 'vue-i18n'
import { useProjectsStore } from '@/stores/projectsStore.ts'
import { onMounted } from 'vue'
import type { Project } from '#/project.ts'

const props = defineProps<ProjectsTableProps>()

const emit = defineEmits<{
    rowClick: [row: Project]
}>()

const { t } = useI18n()
const projectsStore = useProjectsStore()
const { getProjects, pagination, filter, columns, projectsUserHasARoleIn, showArchived, computeStatusInfos } =
    useProjectsTable(props)

onMounted(async () => {
    await getProjects()
})
</script>

<template>
    <QTable
        v-model:pagination="pagination"
        binary-state-sort
        :columns
        :filter="filter"
        flat
        :loading="projectsStore.projectsLoading"
        row-key="id"
        :rows="projectsStore.projects"
        :rows-per-page-options="[5, 10, 15, 20, 50, 100]"
        @request="getProjects"
        @row-click="(_, row: Project) => emit('rowClick', row)"
    >
        <template #top-left>
            <AtomicButton
                icon="mdi-filter-outline"
                :label="`${t('common.filter')} (${[projectsUserHasARoleIn, showArchived].filter((el, index) => (index === 0 && userSpecific ? false : el)).length})`"
            >
                <QMenu>
                    <QList>
                        <QItem
                            v-if="!userSpecific"
                            dense
                        >
                            <QCheckbox
                                v-model="projectsUserHasARoleIn"
                                :label="t('views.projects.filters.participant', 2)"
                                @update:model-value="() => getProjects()"
                            />
                        </QItem>
                        <QItem dense>
                            <QCheckbox
                                v-model="showArchived"
                                :label="t('views.projects.filters.archived', 2)"
                                @update:model-value="() => getProjects()"
                            />
                        </QItem>
                    </QList>
                </QMenu>
            </AtomicButton>
        </template>
        <template #top-right>
            <AtomicInput
                v-model="filter"
                clearable
                debounce="1000"
                dense
                :placeholder="t('common.search')"
            >
                <template v-slot:append>
                    <QIcon name="mdi-magnify" />
                </template>
            </AtomicInput>
        </template>
        <template #body-cell-name="{ value }">
            <QTd>
                <p class="cell-ellipsis">{{ value }}</p>
            </QTd>
        </template>
        <template #body-cell-description="{ value }">
            <QTd>
                <p class="cell-ellipsis">{{ value }}</p>
            </QTd>
        </template>
        <template #body-cell-isPrivate="{ value }">
            <QTd class="visibility">
                <QIcon
                    :name="value ? 'mdi-incognito' : 'mdi-earth'"
                    size="sm"
                />
                <p>{{ value ? t('common.private') : t('common.public') }}</p>
            </QTd>
        </template>
        <template #body-cell-status="{ row }">
            <QTd>
                <QChip
                    class="status"
                    :color="computeStatusInfos(row.status).color"
                    :icon="computeStatusInfos(row.status).icon"
                    :outline="computeStatusInfos(row.status).outline || false"
                    size="0.8rem"
                    :text-color="!computeStatusInfos(row.status).color ? undefined : 'white'"
                >
                    {{ computeStatusInfos(row.status).message }}
                </QChip>
            </QTd>
        </template>
    </QTable>
</template>

<style scoped lang="sass">
.cell-ellipsis
    width: 24vw
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

.visibility
    display: flex
    align-items: center
    gap: 0.5rem
</style>
