import { computed, type Ref, ref, type ShallowRef, useTemplateRef } from 'vue'
import type { Resource } from '#/project.ts'
import { ResourceStatus, Roles } from '#/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.ts'
import type { QTable, QTableProps } from 'quasar'
import { useResourceStore } from '@/stores/resourceStore.ts'

export interface TableProjectResources {
    ref: Readonly<ShallowRef<QTable | null>>
    rows: Ref<Resource[]>
    filter: Ref<string>
    loading: Ref<boolean>
    columns: QTable['columns']
    pagination: Ref<{
        sortBy: string
        descending: boolean
        page: number
        rowsPerPage: number
        rowsNumber: number
    }>
    onRequest: (props: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => Promise<void>
}

export const useProjectResources = () => {
    const projectStore = useProjectStore()
    const resourceStore = useResourceStore()
    const userStore = useUserStore()
    const { t } = useI18n()

    const tabs = [
        { name: 'all', label: t('project.resources.all') },
        { name: 'position', label: t('project.resources.status.toPosition') },
        { name: 'arbitration', label: t('project.resources.status.toArbitrate') },
        { name: 'instruction', label: t('project.resources.status.toInstruct') },
    ]
    const tab = ref<string>('all')

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
        onRequest: async (props: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
            const resourceStore = useResourceStore()
            await resourceStore.fetchResources({ props, table })
        },
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
    const resourceIdSelected = ref<string>('')

    const onRowClick = (_: Event, row: Resource) => {
        resourceIdSelected.value = row.id
        resourceDialog.value = true
    }

    return {
        tab,
        tabs,
        librariesOptions,
        selectDefaultLibrary,
        librariesComparedOptions,
        table,
        resourceDialog,
        resourceIdSelected,
        onRowClick,
    }
}
