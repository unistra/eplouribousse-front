import { computed, ref, useTemplateRef } from 'vue'
import type { Resource, Tab } from '#/project.ts'
import { ResourceStatus, Roles } from '&/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import type { QTable, QTableProps } from 'quasar'
import { useResourceStore } from '@/stores/resourceStore.ts'
import type { TableProjectResources } from '#/table.ts'
import { storeToRefs } from 'pinia'

export const useProjectResources = () => {
    const projectStore = useProjectStore()
    const resourceStore = useResourceStore()
    const userStore = useUserStore()
    const { t } = useI18n()

    const tabs = [
        { name: 'positioning', label: t('project.resources.status.toPosition'), status: ResourceStatus.Positioning },
        {
            name: 'instructionBound',
            label: t('project.resources.status.toInstructBound'),
            status: ResourceStatus.InstructionBound,
        },
        {
            name: 'instructionUnbound',
            label: t('project.resources.status.toInstructUnbound'),
            status: ResourceStatus.InstructionUnbound,
        },
        { name: 'control', label: t('project.resources.status.toControl'), status: ResourceStatus.ControlBound },
    ]
    const tab = ref<Tab>('positioning')
    const tabStatus = computed(() => {
        const t = tabs.find((el) => el.name === tab.value)
        return t ? t.status : ResourceStatus.Positioning
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

    const computeStatusLabel = (val: ResourceStatus, row: Resource) => {
        if (val === ResourceStatus.Positioning) {
            if (row.shouldPosition) return t('project.resources.status.positioningRequired')
            if (projectStore.isRole(Roles.Instructor, resourceStore.libraryIdSelected))
                return t('project.resources.status.waitingPositioning')

            return t('project.resources.status.positioning')
        }

        if (val === ResourceStatus.InstructionBound) return t('project.resources.status.instructionBound')
        if (val === ResourceStatus.ControlBound) return t('project.resources.status.controlBound')
        if (val === ResourceStatus.InstructionUnbound) return t('project.resources.status.instructionUnbound')
        else return t('project.resources.status.controlUnbound')
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
                format: computeStatusLabel,
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

        if (switchTab && !props) table.pagination.value.page = 1

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

    const { libraryIdSelected, libraryIdComparedSelected } = storeToRefs(useResourceStore())
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
        tab,
        tabs,
        table,
        resourceDialog,
        selectDefaultLibrary,
        onRowClick,
        selects,
        fetchResources,
    }
}
