import { computed, ref } from 'vue'
import type { Resource } from '#/project.ts'
import { PositioningFilter, ResourceStatus, Roles, Tab } from '&/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import type { QTableProps } from 'quasar'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { storeToRefs } from 'pinia'

type useProjectResourceTab = {
    name: string
    label: string
    status: ResourceStatus | ResourceStatus[]
    icon: string
}

type StatusInfo = { message: string; icon: string; color?: string }

export const useProjectResources = () => {
    const { t } = useI18n()
    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const resourcesStore = useResourcesStore()
    const { libraryIdSelected, libraryIdComparedSelected } = storeToRefs(useResourcesStore())

    // REFS
    const disableLibrarySelectedSelect = ref<boolean>(false)

    const resourceIdSelected = ref<string>('')
    const resourceDialog = ref<boolean>(false)

    // COMPUTED
    const tabStatus = computed(() => {
        const tab = tabs.find((el) => el.name === projectStore.tab)
        return tab ? tab.status : ResourceStatus.Positioning
    })

    // FUNCTIONS
    const computeStatusInfos = (row: Resource): StatusInfo => {
        if (row.arbitration !== 2)
            return {
                message: t('project.resources.status.toArbitrate') + ` ${row.arbitration}`,
                icon: 'mdi-gavel',
                color: 'negative',
            }

        if (row.status === ResourceStatus.Positioning) {
            const infos: StatusInfo = { message: '', icon: 'mdi-podium' }
            if (row.shouldPosition) {
                infos.message = t('project.resources.status.positioningRequired')
                infos.color = 'primary'
                return infos
            }
            if (projectStore.isRole(Roles.Instructor, libraryIdSelected.value)) {
                infos.message = t('project.resources.status.waitingPositioning')
                return infos
            }
            infos.message = t('project.resources.status.positioning')
            return infos
        }
        if (row.status === ResourceStatus.Excluded)
            return { message: t('project.resources.status.excluded'), icon: 'mdi-cancel' }
        if (row.status === ResourceStatus.InstructionBound) {
            if (projectStore.tab === Tab.Positioning)
                return {
                    message: t('project.resources.status.instructionBoundButPositioningTab'),
                    icon: 'mdi-timer-outline',
                }
            return { message: t('project.resources.status.instructionBound'), icon: 'mdi-segment' }
        }
        if (row.status === ResourceStatus.ControlBound)
            return { message: t('project.resources.status.controlBound'), icon: 'mdi-shield-check-outline' }
        if (row.status === ResourceStatus.InstructionUnbound)
            return { message: t('project.resources.status.instructionUnbound'), icon: 'mdi-segment' }
        if (row.status === ResourceStatus.ControlUnbound)
            return { message: t('project.resources.status.controlUnbound'), icon: 'mdi-shield-check-outline' }
        if (row.status === ResourceStatus.AnomalyBound)
            return {
                message: t('project.resources.status.anomaliesBound'),
                icon: 'mdi-alert-octagon',
                color: 'negative',
            }
        if (row.status === ResourceStatus.AnomalyUnbound)
            return {
                message: t('project.resources.status.anomaliesUnbound'),
                icon: 'mdi-alert-octagon',
                color: 'negative',
            }
        if (row.status === ResourceStatus.Edition)
            return {
                message: t('project.resources.resultant.i'),
                icon: 'mdi-table-check',
            }

        return { message: t('common.error'), icon: 'mdi-alert-outline' }
    }

    const selectDefaultLibrary = () => {
        if (!userStore.user?.id) {
            libraryIdSelected.value = ''
            libraryIdComparedSelected.value = ''
            return
        }

        const librariesIdWhereUserIsInstructor =
            projectStore.project?.roles
                .filter((el) => el.user.id === userStore.user?.id && el.role === Roles.Instructor)
                .map((el) => el.libraryId) || []

        libraryIdSelected.value = librariesIdWhereUserIsInstructor[0] || ''
    }

    const openResourceDialog = (resourceId: string) => {
        resourceIdSelected.value = resourceId
        resourceDialog.value = true
    }

    const fetchResources = async (options?: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
        if (!options) resourcesStore.pagination.page = 1

        if (projectStore.tab === Tab.Anomalies) {
            libraryIdSelected.value = ''
            libraryIdComparedSelected.value = ''
            disableLibrarySelectedSelect.value = true
        } else {
            disableLibrarySelectedSelect.value = false
        }

        const params: Parameters<typeof resourcesStore.getResources>[0] = {
            ...(options && {
                ordering: `${options.pagination.descending ? '-' : ''}${options.pagination.sortBy}`,
                page: options?.pagination.page,
                page_size: options?.pagination.rowsPerPage,
            }),

            status: [tabStatus.value].flat(),
        }
        await resourcesStore.getResources(params)
    }

    // STATICS
    const selectFilterOnPositioning: { label: string; value: PositioningFilter }[] = [
        { label: t('common.all'), value: PositioningFilter.All },
        { label: t('project.positioning.filter.positioningOnly'), value: PositioningFilter.PositioningOnly },
        {
            label: t('project.positioning.filter.instructionNotStarted'),
            value: PositioningFilter.InstructionNotStarted,
        },
        { label: t('project.positioning.filter.arbitration'), value: PositioningFilter.Arbitation },
        { label: t('project.positioning.filter.excluded'), value: PositioningFilter.Excluded },
    ]

    const tabs: useProjectResourceTab[] = [
        {
            name: Tab.Positioning,
            label: t('project.resources.status.toPosition'),
            status: ResourceStatus.Positioning,
            icon: 'mdi-podium',
        },
        {
            name: Tab.InstructionBound,
            label: t('project.resources.status.toInstructBound'),
            status: ResourceStatus.InstructionBound,
            icon: 'mdi-book-open-page-variant',
        },
        {
            name: Tab.InstructionUnbound,
            label: t('project.resources.status.toInstructUnbound'),
            status: ResourceStatus.InstructionUnbound,
            icon: 'mdi-file-multiple',
        },
        {
            name: Tab.Control,
            label: t('project.resources.status.toControl'),
            status: [ResourceStatus.ControlBound, ResourceStatus.ControlUnbound],
            icon: 'mdi-shield-check',
        },
        {
            name: Tab.Anomalies,
            label: t('project.resources.status.anomalies', 2),
            status: [ResourceStatus.AnomalyBound, ResourceStatus.AnomalyUnbound],
            icon: 'mdi-alert-circle',
        },
        {
            name: Tab.Edition,
            label: t('project.resources.resultant.i', 2),
            status: ResourceStatus.Edition,
            icon: 'mdi-table-check',
        },
    ]

    const selects = [
        {
            model: libraryIdSelected,
            label: t('project.resources.showResources'),
            options: computed(() => {
                if (!projectStore.project) return []
                return [...projectStore.project.libraries, { name: t('common.all'), id: '' }]
            }),
            name: 'librariesSelection',
        },
        {
            model: libraryIdComparedSelected,
            label: t('project.resources.compareWith'),
            options: computed(() => {
                if (!projectStore.project) return []
                return [
                    { name: t('common.all'), id: '' },
                    ...projectStore.project.libraries.filter((lib) => lib.id !== libraryIdSelected.value),
                ]
            }),
            name: 'librariesComparison',
        },
    ]

    const columns: QTableProps['columns'] = [
        {
            name: 'title',
            required: true,
            label: t('project.resources.title'),
            align: 'left',
            field: 'title',
            sortable: true,
        },
        {
            name: 'code',
            label: t('project.resources.code'),
            align: 'left',
            field: 'code',
        },
        {
            name: 'count',
            label: t('project.resources.count'),
            align: 'left',
            field: 'count',
            sortable: true,
        },
        {
            name: 'status',
            label: t('project.resources.status.title'),
            align: 'left',
            field: 'status',
        },
    ]

    return {
        tabs,
        columns,
        resourceIdSelected,
        resourceDialog,
        openResourceDialog,
        selectDefaultLibrary,
        selects,
        fetchResources,
        disableLibrarySelectedSelect,
        computeStatusInfos,
        selectFilterOnPositioning,
    }
}
