import { computed, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import type { Segment } from '#/project.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'

export const useProjectInstruction = () => {
    const { t } = useI18n()
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()

    const tableLoading = ref<boolean>(false)

    const columns: QTableColumn[] = [
        {
            name: 'order',
            label: t('project.instruction.tableFields.order'),
            field: 'order',
        },
        {
            name: 'library',
            label: t('project.instruction.tableFields.library'),
            field: 'library',
            format(_val: unknown, row: Segment) {
                const libraryId = resourceStore.collections.find((el) => el.id === row.collection)?.library || null
                const library = projectStore.libraries.find((el) => el.id === libraryId) || null
                return library?.name || t('common.error')
            },
        },
        {
            name: 'content',
            label: t('project.instruction.tableFields.segment'),
            field: 'content',
        },
        {
            name: 'segmentType',
            label: t('project.instruction.tableFields.boundOrUnbound'),
            field: 'segmentType',
        },
        {
            name: 'improvableElements',
            label: t('project.instruction.tableFields.improvableElements'),
            field: 'improvableElements',
        },
        {
            name: 'exception',
            label: t('project.instruction.tableFields.exception'),
            field: 'exception',
        },
        {
            name: 'reorder',
            label: t('project.instruction.tableFields.reorder'),
            field: 'reorder',
        },
    ]

    const orderedRows = computed(() => [...resourceStore.segments].sort((a, b) => a.order - b.order))

    const orderSegment = async (row: Segment, direction: 'up' | 'down') => {
        tableLoading.value = true
        await resourceStore.orderSegment(row, direction)
        tableLoading.value = false
    }

    return {
        tableLoading,
        columns,
        orderedRows,
        orderSegment,
    }
}
