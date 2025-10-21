import { computed, reactive, ref, toRefs } from 'vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import type { QTableColumn } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { Segment } from '#/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Tab } from '&/project.ts'

interface UseProjectSegmentTableState {
    loading: boolean
}

const state = reactive<UseProjectSegmentTableState>({
    loading: false,
})

export const useProjectSegmentTable = () => {
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()
    const { t } = useI18n()
    const hoveredValue = ref<string | null>(null)

    const isSegmentTypeSameAsInstructionTab = (segment: Segment) => {
        return (
            (segment.segmentType === 'bound' && projectStore.tab === Tab.InstructionBound) ||
            (segment.segmentType === 'unbound' && projectStore.tab === Tab.InstructionUnbound) ||
            projectStore.tab === Tab.Control ||
            projectStore.tab === Tab.Anomalies
        )
    }

    const displayOptionsColumnBasedOnUserRole = (segment?: Segment) => {
        return (
            (projectStore.userIsInstructorForLibrarySelected &&
                (projectStore.tab === Tab.InstructionBound || projectStore.tab === Tab.InstructionUnbound) &&
                (segment ? isSegmentTypeSameAsInstructionTab(segment) : true)) ||
            (projectStore.userIsController && projectStore.tab === Tab.Control) ||
            (projectStore.userIsAdmin && projectStore.tab === Tab.Anomalies)
        )
    }

    const displayNewSegmentButton = computed(
        () =>
            (resourceStore.shouldInstruct &&
                projectStore.userIsInstructorForLibrarySelected &&
                (projectStore.tab === Tab.InstructionBound || projectStore.tab === Tab.InstructionUnbound)) ||
            (projectStore.userIsAdmin && projectStore.tab === Tab.Anomalies),
    )

    const dialogCreateSegment = ref<boolean>(false)
    const insertAfter = ref<string>()

    const columns: QTableColumn[] = [
        {
            name: 'order',
            label: t('project.instruction.tableFields.line'),
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
            format(val: 'bound' | 'unbound') {
                return val === 'bound'
                    ? t('project.instruction.segment.bound')
                    : t('project.instruction.segment.unbound')
            },
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
            name: 'anomalies',
            label: t('project.anomaly.i', 2),
            field: 'anomalies',
            align: 'center',
        },
    ]

    if (displayOptionsColumnBasedOnUserRole()) {
        columns.push({
            name: 'options',
            label: t('project.instruction.tableFields.options'),
            field: 'options',
            align: 'center',
        })
    }

    const orderedRows = computed(() => [...resourceStore.segments].sort((a, b) => a.order - b.order))

    const openDialogCreateSegment = (insertAfterId: string | undefined = undefined) => {
        dialogCreateSegment.value = true
        insertAfter.value = insertAfterId
    }

    return {
        ...toRefs(state),
        columns,
        orderedRows,
        hoveredValue,
        dialogCreateSegment,
        insertAfter,
        openDialogCreateSegment,
        displayOptionsColumnBasedOnUserRole,
        displayNewSegmentButton,
    }
}
