<script setup lang="ts">
import {
    type ProjectDashboardTableType,
    useProjectDashboardTable,
} from '@/components/project/projectDashboard/useProjectDashboardTable.ts'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'

const props = defineProps<{
    type: ProjectDashboardTableType
}>()

const { t } = useI18n()
const { tableData, getData, filteredTableDataKeys, loading } = useProjectDashboardTable()

onMounted(async () => {
    await getData(props.type)
})
</script>

<template>
    <div v-if="loading || tableData">
        <QMarkupTable separator="cell">
            <thead>
                <tr>
                    <QSkeleton
                        v-if="loading"
                        type="text"
                    />
                    <th v-else>{{ tableData?.title }}</th>
                    <th class="grey-cell" />
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
                        {{ tableData?.[key] }}
                    </td>
                </tr>
            </tbody>
        </QMarkupTable>
        <p
            v-if="tableData?.computedAt"
            class="computed-at"
        >
            <QIcon
                name="mdi-cached"
                size="1.5rem"
            />
            {{ t('project.dashboard.computedAt') }}
            {{ useUtils().useIntlDateTimeFormat(tableData.computedAt) }}
        </p>
    </div>

    <p v-else>{{ t('errors.dataUnreachable') }}</p>
</template>

<style scoped lang="sass">
th
    font-weight: bold
    text-align: left
    background-color: var(--epl-color-light-green)

thead tr
    th
        border-right: none
        border-left: none

.computed-at
    font-size: 0.875rem
    color: grey
    font-style: italic
    margin-top: 0.5rem
    text-align: right
</style>
