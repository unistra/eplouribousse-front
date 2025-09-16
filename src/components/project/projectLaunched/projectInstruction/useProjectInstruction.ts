import { computed, ref } from 'vue'
import { Notify, type QTableColumn } from 'quasar'
import type { Segment } from '#/project.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { axiosI } from '@/plugins/axios/axios'

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
            name: 'collection',
            label: t('project.instruction.tableFields.collection'),
            field: 'collection',
            format(_val: unknown, row: Segment) {
                const collection = resourceStore.collections.find((el) => el.id === row.collection)
                return `${t('project.resources.position')}: ${collection?.position} | ${t('project.resources.callNumber')}: ${collection?.callNumber}`
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
            name: 'resolve',
            label: t('project.instruction.tableFields.resolve'),
            field: 'resolve',
            format(_val: unknown, row: Segment) {
                return resourceStore.segments.find((el) => el.id === row.improvedSegment)?.order.toString() || '-'
            },
        },
        {
            name: 'options',
            label: t('project.instruction.tableFields.options'),
            field: 'options',
        },
    ]

    const orderedRows = computed(() => [...resourceStore.segments].sort((a, b) => a.order - b.order))

    const orderSegment = async (row: Segment, direction: 'up' | 'down') => {
        tableLoading.value = true
        await resourceStore.orderSegment(row, direction)
        tableLoading.value = false
    }

    const deleteSegment = async (row: Segment) => {
        tableLoading.value = true
        try {
            await axiosI.delete(`segments/${row.id}/`)
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            tableLoading.value = false
        }
    }

    const dialogUpdateSegment = ref<boolean>(false)
    const dialogCreateSegment = ref<boolean>(false)

    return {
        tableLoading,
        columns,
        orderedRows,
        orderSegment,
        deleteSegment,
        dialogUpdateSegment,
        dialogCreateSegment,
    }
}
