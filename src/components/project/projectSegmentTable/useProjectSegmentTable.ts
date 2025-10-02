import { computed, ref } from 'vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import type { QTableColumn } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { Segment } from '#/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'

export const useProjectSegmentTable = () => {
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()
    const { t } = useI18n()
    const loading = ref<boolean>(false)
    const hoveredValue = ref<string | null>(null)

    const dialogCreateSegment = ref<boolean>(false)
    const insertAfter = ref<string>()

    const addAnomaly = ref<boolean>(false)
    const onAddAnomaly = (props: { expand: boolean }) => {
        addAnomaly.value = true
        props.expand = true
    }
    const cancelAddAnomaly = (props: { expand: boolean }) => {
        addAnomaly.value = false
        props.expand = false
    }

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
            name: 'anomalies',
            label: t('project.anomaly.i', 2),
            field: '',
            align: 'center',
        },
    ]

    if (resourceStore.isInstructorForLibrarySelected) {
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

    const filteredAnomaliesBySegment = (segmentId: string) =>
        resourceStore.anomalies.filter((el) => el.segment.id === segmentId)

    return {
        columns,
        loading,
        orderedRows,
        hoveredValue,
        dialogCreateSegment,
        insertAfter,
        openDialogCreateSegment,
        filteredAnomaliesBySegment,
        addAnomaly,
        onAddAnomaly,
        cancelAddAnomaly,
    }
}
