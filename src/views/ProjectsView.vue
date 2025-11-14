<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsView } from '@/components/projects/useProjectsView.ts'
import { useI18n } from 'vue-i18n'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const {
    projects,
    fetchProjects,
    pagination,
    loading,
    filter,
    columns,
    projectsUserHasARoleIn,
    showArchived,
    computeStatusInfos,
} = useProjectsView()

onMounted(async () => {
    await fetchProjects()
})
</script>

<template>
    <QPage padding>
        <h1>{{ route.meta.title }}</h1>
        <QTable
            v-model:pagination="pagination"
            binary-state-sort
            :columns
            :filter="filter"
            flat
            :loading
            row-key="id"
            :rows="projects"
            :rows-per-page-options="[5, 10, 15, 20, 50, 100]"
            @request="fetchProjects"
            @row-click="(_, row) => router.push({ name: 'project', params: { id: row.id } })"
        >
            <template #top-left>
                <AtomicButton
                    icon="mdi-filter-outline"
                    :label="`${t('common.filter')} (${[projectsUserHasARoleIn, showArchived].filter((el) => !!el).length})`"
                >
                    <QMenu>
                        <QList>
                            <QItem dense>
                                <QCheckbox
                                    v-model="projectsUserHasARoleIn"
                                    :label="t('view.projects.filters.participant')"
                                    @update:model-value="() => fetchProjects()"
                                />
                            </QItem>
                            <QItem dense>
                                <QCheckbox
                                    v-model="showArchived"
                                    :label="t('view.projects.filters.archived')"
                                    @update:model-value="() => fetchProjects()"
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
    </QPage>
</template>

<style lang="sass" scoped>
main
    display: flex
    flex-direction: column
    gap: 2rem

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
