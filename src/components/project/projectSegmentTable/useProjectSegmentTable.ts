import { computed, reactive, ref, toRefs } from 'vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import type { QTableColumn } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { Segment } from '#/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Tab } from '&/project.ts'
import { useProjectEdition } from '@/components/project/projectLaunched/projectEdition/useProjectEdition.ts'

interface UseProjectSegmentTableState {
    loading: boolean
}

const state = reactive<UseProjectSegmentTableState>({
    loading: false,
})

export const NULL_SEGMENT = '~~Nihil~~'

export const useProjectSegmentTable = () => {
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()
    const { t } = useI18n()
    const improvedSegmentIdHovered = ref<string | null>(null)

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
            label: t('common.line'),
            field: 'order',
            align: 'center',
        },
        {
            name: 'library',
            label: t('libraries.i'),
            field: 'library',
            format(_val: unknown, row: Segment) {
                if (!projectStore.project) return t('common.error')
                const libraryId = resourceStore.collections.find((el) => el.id === row.collection)?.library || null
                const library = projectStore.project.libraries.find((el) => el.id === libraryId) || null
                return library?.name || t('common.error')
            },
            align: 'center',
        },
        {
            name: 'collection',
            label: t('collection.i'),
            field: 'collection',
            format(_val: unknown, row: Segment): string {
                const collection = resourceStore.collections.find((el) => el.id === row.collection)
                return collection ? resourceStore.formatCollectionToString(collection) : ''
            },
            align: 'center',
        },
        {
            name: 'segmentType',
            label: t('segment.boundOrUnbound'),
            field: 'segmentType',
            align: 'center',
            format(val: 'bound' | 'unbound') {
                return val === 'bound'
                    ? t('project.instruction.segment.bound')
                    : t('project.instruction.segment.unbound')
            },
        },
        {
            name: 'content',
            label: t('segment.i'),
            field: 'content',
            align: 'center',
        },
        {
            name: 'exception',
            label: t('segment.exception'),
            field: 'exception',
            align: 'center',
        },
        {
            name: 'improvableElements',
            label: t('segment.improvableElements'),
            field: 'improvableElements',
            align: 'center',
        },
        {
            name: 'resolve',
            label: t('segment.resolve'),
            field: 'resolve',
            format(_val: unknown, row: Segment) {
                if (!projectStore.project) return t('errors.dataUnreachable')

                const segmentImproved = resourceStore.segments.find((el) => el.id === row.improvedSegment)
                if (!segmentImproved) return '-'

                const segmentString = segmentImproved?.order.toString()

                const collection = resourceStore.collections.find(
                    (collection) => collection.id === segmentImproved.collection,
                )

                const libraryString =
                    projectStore.project.libraries.find((library) => library.id === collection?.library)?.name ||
                    t('utils.noLibrary')
                return `${libraryString} | ${t('project.instruction.tableFields.line')}: ${segmentString}`
            },
            align: 'center',
        },
    ]

    if (projectStore.tab !== Tab.Edition) {
        columns.push({
            name: 'anomalies',
            label: t('project.anomaly.i', 2),
            field: 'anomalies',
            align: 'center',
        })
    }
    if (displayOptionsColumnBasedOnUserRole()) {
        columns.push({
            name: 'options',
            label: t('project.instruction.tableFields.options'),
            field: 'options',
            align: 'center',
        })
    }

    const orderedRows = computed<Segment[]>(() => [...resourceStore.segments].sort((a, b) => a.order - b.order))

    const openDialogCreateSegment = (insertAfterId: string | undefined = undefined) => {
        dialogCreateSegment.value = true
        insertAfter.value = insertAfterId
    }

    const { selectCollectionToShowEdition } = useProjectEdition()

    const isHighlightedRow = (collectionId: string) => {
        if (!selectCollectionToShowEdition.value) return false
        return collectionId === selectCollectionToShowEdition.value?.id
    }
    const isSemiHighlightedRow = (improvedSegmentId: string) => {
        if (!selectCollectionToShowEdition.value) return false

        const segment = resourceStore.segments.find((segment) => segment.id === improvedSegmentId)
        return segment?.collection === selectCollectionToShowEdition.value.id
    }

    return {
        ...toRefs(state),
        columns,
        orderedRows,
        improvedSegmentIdHovered,
        dialogCreateSegment,
        insertAfter,
        openDialogCreateSegment,
        displayOptionsColumnBasedOnUserRole,
        displayNewSegmentButton,
        isHighlightedRow,
        isSemiHighlightedRow,
    }
}
