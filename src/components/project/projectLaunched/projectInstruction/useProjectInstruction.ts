import { computed, ref } from 'vue'
import { type QTableColumn } from 'quasar'
import type { InstructionTurn, Segment } from '#/project.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { ResourceStatus } from '&/project.ts'

export const useProjectInstruction = () => {
    const { t } = useI18n()
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()

    const deleteSegmentModal = ref<boolean>(false)
    const tableLoading = ref<boolean>(false)

    const columns: QTableColumn[] = [
        {
            name: 'order',
            label: t('project.instruction.tableFields.order'),
            field: 'order',
            align: 'center',
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
            align: 'center',
        },
        {
            name: 'collection',
            label: t('project.instruction.tableFields.collection'),
            field: 'collection',
            format(_val: unknown, row: Segment) {
                const collection = resourceStore.collections.find((el) => el.id === row.collection)
                return `${t('project.resources.position')}: ${collection?.position} | ${t('project.resources.callNumber')}: ${collection?.callNumber}`
            },
            align: 'center',
        },
        {
            name: 'content',
            label: t('project.instruction.tableFields.segment'),
            field: 'content',
            align: 'center',
        },
        {
            name: 'segmentType',
            label: t('project.instruction.tableFields.boundOrUnbound'),
            field: 'segmentType',
            align: 'center',
        },
        {
            name: 'improvableElements',
            label: t('project.instruction.tableFields.improvableElements'),
            field: 'improvableElements',
            align: 'center',
        },
        {
            name: 'exception',
            label: t('project.instruction.tableFields.exception'),
            field: 'exception',
            align: 'center',
        },
        {
            name: 'resolve',
            label: t('project.instruction.tableFields.resolve'),
            field: 'resolve',
            format(_val: unknown, row: Segment) {
                return resourceStore.segments.find((el) => el.id === row.improvedSegment)?.order.toString() || '-'
            },
            align: 'center',
        },
        {
            name: 'options',
            label: t('project.instruction.tableFields.options'),
            field: 'options',
            align: 'center',
        },
    ]

    const orderedRows = computed(() => [...resourceStore.segments].sort((a, b) => a.order - b.order))

    const orderSegment = async (row: Segment, direction: 'up' | 'down') => {
        tableLoading.value = true
        await resourceStore.orderSegment(row, direction)
        tableLoading.value = false
    }

    const dialogUpdateSegment = ref<boolean>(false)
    const dialogCreateSegment = ref<boolean>(false)
    const insertAfter = ref<string | undefined>()

    const openDialogCreateSegment = (insertAfterId: string | undefined = undefined) => {
        dialogCreateSegment.value = true
        insertAfter.value = insertAfterId
    }

    const turnsWithNames = computed(() => {
        if (![ResourceStatus.InstructionBound, ResourceStatus.InstructionUnbound].includes(resourceStore.status))
            return null

        const retrieveCollectionName = (el: InstructionTurn): string => {
            const collection = resourceStore.collections.find((collection) => collection.id === el.collection)
            return `${t('project.resources.callNumber')}: ${collection?.callNumber} - ${t('project.resources.holdStatement')}: ${collection?.holdStatement} - ${t('project.resources.position')}: ${collection?.position}`
        }

        return resourceStore.instructionTurns?.[`${resourceStore.statusName}`].turns.map((el: InstructionTurn) => ({
            library: projectStore.libraries.find((library) => library.id === el.library)?.name,
            collection: retrieveCollectionName(el),
        }))
    })

    const hoveredValue = ref<string | null>(null)

    return {
        tableLoading,
        columns,
        orderedRows,
        orderSegment,
        dialogUpdateSegment,
        dialogCreateSegment,
        deleteSegmentModal,
        insertAfter,
        openDialogCreateSegment,
        turnsWithNames,
        hoveredValue,
    }
}
