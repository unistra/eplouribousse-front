import { computed, isRef, type Ref, ref, useTemplateRef } from 'vue'
import type { Resource } from '#/project.ts'
import { ResourceStatus, Roles, Tab } from '&/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import type { QTable, QTableProps } from 'quasar'
import { useResourceStore } from '@/stores/resourceStore.ts'
import type { TableProjectResources } from '#/table.ts'
import { storeToRefs } from 'pinia'

type useProjectResourceToggleAnomaliesTypes = ResourceStatus.AnomalyBound | ResourceStatus.AnomalyUnbound
type useProjectResourceToggleControlTypes = ResourceStatus.ControlBound | ResourceStatus.ControlUnbound

type useProjectResourceTab = {
    name: string
    label: string
    status: ResourceStatus | Ref<useProjectResourceToggleAnomaliesTypes | useProjectResourceToggleControlTypes>
    icon: string
}

type StatusInfo = { message: string; icon: string; color?: string }

export const useProjectResources = () => {
    const projectStore = useProjectStore()
    const resourceStore = useResourceStore()
    const userStore = useUserStore()
    const { t } = useI18n()
    const { libraryIdSelected, libraryIdComparedSelected } = storeToRefs(useResourceStore())
    const disableLibrarySelectedSelect = ref<boolean>(false)

    const toggleAnomaliesTypes = ref<useProjectResourceToggleAnomaliesTypes>(ResourceStatus.AnomalyBound)
    const toggleControlTypes = ref<useProjectResourceToggleControlTypes>(ResourceStatus.ControlBound)

    const tabs: useProjectResourceTab[] = [
        {
            name: 'positioning',
            label: t('project.resources.status.toPosition'),
            status: ResourceStatus.Positioning,
            icon: 'mdi-podium',
        },
        {
            name: 'instructionBound',
            label: t('project.resources.status.toInstructBound'),
            status: ResourceStatus.InstructionBound,
            icon: 'mdi-book-open-page-variant',
        },
        {
            name: 'instructionUnbound',
            label: t('project.resources.status.toInstructUnbound'),
            status: ResourceStatus.InstructionUnbound,
            icon: 'mdi-file-multiple',
        },
        {
            name: 'control',
            label: t('project.resources.status.toControl'),
            status: toggleControlTypes,
            icon: 'mdi-shield-check',
        },
        {
            name: 'anomalies',
            label: t('project.resources.status.anomalies', 2),
            status: toggleAnomaliesTypes,
            icon: 'mdi-alert-circle',
        },
    ]
    const tabStatus = computed(() => {
        const t = tabs.find((el) => el.name === projectStore.tab)
        return t ? (isRef(t.status) ? t.status.value : t.status) : ResourceStatus.Positioning
    })

    const librariesOptions = computed(() => {
        return [...projectStore.libraries, { name: t('common.all'), id: '' }]
    })

    const librariesComparedOptions = computed(() => {
        return [
            { name: t('common.none'), id: '' },
            ...projectStore.libraries.filter((lib) => lib.id !== resourceStore.libraryIdSelected),
        ]
    })

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
            if (projectStore.isRole(Roles.Instructor, resourceStore.libraryIdSelected)) {
                infos.message = t('project.resources.status.waitingPositioning')
                return infos
            }
            infos.message = t('project.resources.status.positioning')
            return infos
        }

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
        return { message: t('common.error'), icon: 'mdi-alert-outline' }
    }

    const table: TableProjectResources = {
        ref: useTemplateRef<QTable>('qTable'),
        rows: ref<Resource[]>([]),
        filter: ref<string>(''),
        loading: ref(false),
        columns: [
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
                sortable: true,
            },
        ],
        pagination: ref({
            sortBy: 'name',
            descending: false,
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 0,
        }),
    }

    const selectDefaultLibrary = () => {
        if (!userStore.user?.id) {
            resourceStore.libraryIdSelected = ''
            return
        }

        const librariesIdWhereUserIsInstructor = projectStore.roles
            .filter((el) => el.user.id === userStore.user?.id && el.role === Roles.Instructor)
            .map((el) => el.libraryId)

        resourceStore.libraryIdSelected = librariesIdWhereUserIsInstructor[0] || ''
    }

    const resourceDialog = ref<boolean>(false)

    const onRowClick = async (_: Event, row: Resource) => {
        resourceStore.resourceSelected = row
        resourceDialog.value = true
    }

    const fetchResources = async (
        props?: Parameters<NonNullable<QTableProps['onRequest']>>[0],
        switchTab: boolean = false,
    ) => {
        table.loading.value = true

        if (switchTab && !props) {
            table.pagination.value.page = 1

            if (projectStore.tab === Tab.Anomalies) {
                libraryIdSelected.value = ''
                libraryIdComparedSelected.value = ''
                disableLibrarySelectedSelect.value = true
            } else {
                disableLibrarySelectedSelect.value = false
            }
        }

        const options = {
            pagination: props?.pagination ? props?.pagination : table.pagination.value,
            filter: props?.filter ? props?.filter : table.filter,
        }
        await resourceStore.fetchResources(tabStatus.value, {
            table,
            props: options,
        })
        table.loading.value = false
    }

    const selects = [
        {
            model: libraryIdSelected,
            label: t('project.resources.showResources'),
            options: librariesOptions.value,
            callback: fetchResources,
            name: 'librariesSelection',
        },
        {
            model: libraryIdComparedSelected,
            label: t('project.resources.compareWith'),
            options: librariesComparedOptions.value,
            callback: fetchResources,
            name: 'librariesComparison',
        },
    ]

    return {
        tabs,
        table,
        resourceDialog,
        selectDefaultLibrary,
        onRowClick,
        selects,
        fetchResources,
        toggleAnomaliesTypes,
        disableLibrarySelectedSelect,
        toggleControlTypes,
        computeStatusInfos,
    }
}
