<script setup lang="ts">
import {
    type ProjectDashboardTableType,
    useProjectDashboardTable,
} from '@/components/project/projectDashboard/useProjectDashboardTable.ts'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

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
    <QMarkupTable
        v-if="loading || tableData"
        separator="cell"
    >
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

    <p v-else>{{ t('errors.dataUnreachable') }}</p>
</template>

<style scoped lang="sass">
th
    font-weight: bold
</style>
