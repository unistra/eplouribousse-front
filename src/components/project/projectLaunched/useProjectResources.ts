import { computed, ref } from 'vue'
import type { Resource } from '#/project.ts'
import { PositioningFilter, ResourceStatus, ResourceStatusToTab, Roles, Tab } from '&/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import type { QTableProps } from 'quasar'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useResourceStore } from '@/stores/resourceStore.ts'

type useProjectResourceTab = {
    name: string
    label: string
    status: ResourceStatus | ResourceStatus[]
    icon: string
}

type StatusInfo = { message: string; icon: string; color?: string }

export const RESOURCE_QUERY_PARAM = 'resource'

export const useProjectResources = () => {
    const { t } = useI18n()
    const route = useRoute()
    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const resourcesStore = useResourcesStore()
    const resourceStore = useResourceStore()
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
                message: t('fn.resource.arbitration.i') + ` ${row.arbitration}`,
                icon: 'mdi-gavel',
                color: 'negative',
            }

        if (row.status === ResourceStatus.Positioning) {
            const infos: StatusInfo = { message: '', icon: 'mdi-podium' }
            if (row.shouldPosition) {
                infos.message = t('views.project.resources.status.positioningRequired')
                infos.color = 'primary'
                return infos
            }
            if (projectStore.isRole(Roles.Instructor, libraryIdSelected.value)) {
                infos.message = t('views.project.resources.status.waitingPositioning')
                return infos
            }
            infos.message = t('views.project.resources.status.positioning')
            return infos
        }
        if (row.status === ResourceStatus.Excluded)
            return { message: t('views.project.resources.status.excluded'), icon: 'mdi-cancel' }
        if (row.status === ResourceStatus.InstructionBound) {
            if (projectStore.tab === Tab.Positioning)
                return {
                    message: t('views.project.resources.status.instructionBoundButPositioningTab'),
                    icon: 'mdi-timer-outline',
                }
            return { message: t('views.project.resources.status.instructionBound'), icon: 'mdi-segment' }
        }
        if (row.status === ResourceStatus.ControlBound)
            return { message: t('views.project.resources.status.controlBound'), icon: 'mdi-shield-check-outline' }
        if (row.status === ResourceStatus.InstructionUnbound)
            return { message: t('views.project.resources.status.instructionUnbound'), icon: 'mdi-segment' }
        if (row.status === ResourceStatus.ControlUnbound)
            return { message: t('views.project.resources.status.controlUnbound'), icon: 'mdi-shield-check-outline' }
        if (row.status === ResourceStatus.AnomalyBound)
            return {
                message: t('views.project.resources.status.anomaliesBound'),
                icon: 'mdi-alert-octagon',
                color: 'negative',
            }
        if (row.status === ResourceStatus.AnomalyUnbound)
            return {
                message: t('views.project.resources.status.anomaliesUnbound'),
                icon: 'mdi-alert-octagon',
                color: 'negative',
            }
        if (row.status === ResourceStatus.Edition)
            return {
                message: t('views.project.resultant.i'),
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
        { label: t('views.project.resources.filters.all'), value: PositioningFilter.All },
        { label: t('views.project.resources.filters.positioningOnly'), value: PositioningFilter.PositioningOnly },
        {
            label: t('views.project.resources.filters.instructionNotStarted'),
            value: PositioningFilter.InstructionNotStarted,
        },
        { label: t('fn.resource.arbitration.i'), value: PositioningFilter.Arbitation },
        { label: t('views.project.resources.filters.excluded'), value: PositioningFilter.Excluded },
    ]

    const tabs: useProjectResourceTab[] = [
        {
            name: Tab.Positioning,
            label: t('views.project.resources.status.toPosition'),
            status: ResourceStatus.Positioning,
            icon: 'mdi-podium',
        },
        {
            name: Tab.InstructionBound,
            label: t('views.project.resources.status.toInstructBound'),
            status: ResourceStatus.InstructionBound,
            icon: 'mdi-book-open-page-variant',
        },
        {
            name: Tab.InstructionUnbound,
            label: t('views.project.resources.status.toInstructUnbound'),
            status: ResourceStatus.InstructionUnbound,
            icon: 'mdi-file-multiple',
        },
        {
            name: Tab.Control,
            label: t('views.project.resources.status.toControl'),
            status: [ResourceStatus.ControlBound, ResourceStatus.ControlUnbound],
            icon: 'mdi-shield-check',
        },
        {
            name: Tab.Anomalies,
            label: t('views.project.resources.status.anomalies', 2),
            status: [ResourceStatus.AnomalyBound, ResourceStatus.AnomalyUnbound],
            icon: 'mdi-alert-circle',
        },
        {
            name: Tab.Edition,
            label: t('views.project.resultant.i', 2),
            status: ResourceStatus.Edition,
            icon: 'mdi-table-check',
        },
    ]

    const selects = [
        {
            model: libraryIdSelected,
            label: t('views.project.resources.showResources'),
            options: computed(() => {
                if (!projectStore.project) return []
                return [...projectStore.project.libraries, { name: t('common.all'), id: '' }]
            }),
            name: 'librariesSelection',
        },
        {
            model: libraryIdComparedSelected,
            label: t('views.project.resources.compareWith'),
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
            label: t('fn.resource.fields.title'),
            align: 'left',
            field: 'title',
            sortable: true,
        },
        {
            name: 'code',
            label: t('fn.resource.fields.code'),
            align: 'left',
            field: 'code',
        },
        {
            name: 'count',
            label: t('fn.resource.fields.count', 2),
            align: 'left',
            field: 'count',
            sortable: true,
        },
        {
            name: 'status',
            label: t('views.project.resources.status.title'),
            align: 'left',
            field: 'status',
        },
    ]

    const researchFetchedResourcesWhenQueryParam = () => {
        if (!route.query[RESOURCE_QUERY_PARAM] || !resourceStore.resource) return

        // Change tab to corresponding status
        projectStore.tab = ResourceStatusToTab[resourceStore.resource.status]

        // If instruction_turns filled, select the right library
        if (
            (resourceStore.resource.status === ResourceStatus.InstructionBound ||
                resourceStore.resource.status === ResourceStatus.InstructionUnbound) &&
            resourceStore.resource.instructionTurns?.[resourceStore.statusName].turns[0]?.library
        ) {
            if (!resourceStore.resource.instructionTurns[resourceStore.statusName].turns[0]) selectDefaultLibrary()
            libraryIdSelected.value =
                resourceStore.resource.instructionTurns[resourceStore.statusName].turns[0]!.library
        } else {
            selectDefaultLibrary()
        }

        // Used to prevent stepper animation to glitch in modal
        setTimeout(() => {
            resourcesStore.filter = resourceStore.resource!.code // Set filter in setTimeout to ensure action is triggered
        }, 100)
        return
    }

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
        researchFetchedResourcesWhenQueryParam,
    }
}
