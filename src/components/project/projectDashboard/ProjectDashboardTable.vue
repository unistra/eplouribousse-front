<script setup lang="ts">
import { useUtils } from '@/composables/useUtils.ts'
import { useProjectDashboardTable } from '@/components/project/projectDashboard/useProjectDashboardTable.ts'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import type { ProjectDashboardTableType } from '@/components/project/projectDashboard/useProjectDashboard.ts'
import ProjectDashboardErrorCard from '@/components/project/projectDashboard/ProjectDashboardErrorCard.vue'

const props = defineProps<{
    type: ProjectDashboardTableType
}>()

const { t } = useI18n()
const { data, loading, getData, filteredTableDataKeys } = useProjectDashboardTable()

onMounted(async () => await getData(props.type))
</script>

<template>
    <div
        v-if="loading || data"
        class="container"
    >
        <QMarkupTable
            v-if="loading"
            borderedrator="cell"
            class="loading-table"
            flat
            sepa
        >
            <thead>
                <tr>
                    <th scope="col">
                        <QSkeleton type="text" />
                    </th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="el1 in [1, 2]"
                    :key="el1"
                >
                    <td
                        v-for="el2 in [1, 2]"
                        :key="el2"
                    >
                        <QSkeleton type="text" />
                    </td>
                </tr>
            </tbody>
        </QMarkupTable>
        <template v-else>
            <QMarkupTable
                bordered
                flat
                separator="cell"
            >
                <thead>
                    <tr>
                        <th scope="col">{{ data?.title }}</th>
                        <th
                            class="grey-cell"
                            scope="col"
                        />
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="key in filteredTableDataKeys"
                        :key="key"
                    >
                        <td>
                            <QSkeleton
                                v-if="loading"
                                type="text"
                            />
                            <template v-else> {{ key }} </template>
                        </td>
                        <td>
                            <QSkeleton
                                v-if="loading"
                                type="text"
                            />
                            {{ data?.[key] }}
                        </td>
                    </tr>
                </tbody>
            </QMarkupTable>
            <div
                v-if="loading || data"
                class="computed-at"
            >
                <QIcon
                    name="mdi-cached"
                    size="1.25rem"
                />
                <QSkeleton
                    v-if="loading"
                    type="text"
                />
                <p v-else-if="data">
                    {{ t('view.project.dashboard.computedAt') }}
                    {{ useUtils().useIntlDateTimeFormat(data.computedAt) }}
                </p>
            </div>
        </template>
    </div>
    <ProjectDashboardErrorCard v-else />
</template>

<style scoped lang="sass">
.container
    display: flex
    flex-direction: column
    gap: 0.5rem
    flex-grow: 1

.loading-table
    width: 24rem
th
    font-weight: bold
    text-align: left
    background-color: var(--epl-color-light-green)

thead tr
    th
        border-right: none
        border-left: none

.computed-at
    display: flex
    align-items: center
    gap: 0.25rem
    font-size: var(--font-size-xs)
    color: var(--color-neutral-400)
    font-style: italic
    align-self: end

    .q-skeleton
        width: 8rem

.q-card
    width: fit-content
    height: fit-content
    border: 1px solid var(--color-negative)
    color: var(--color-negative)
    .q-card__section
        display: flex
        align-items: center
        gap: 0.5rem
</style>
