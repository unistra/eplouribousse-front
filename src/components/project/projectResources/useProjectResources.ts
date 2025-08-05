import { computed, reactive, type Ref, ref, type ShallowRef, useTemplateRef } from 'vue'
import type { Resource } from '#/project'
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
    columns: {
        name: string
        required?: boolean
        label: string
        align: string
        field: string
        sortable?: boolean
    }[]
    pagination: {
        sortBy: string
        descending: boolean
        page: number
        rowsPerPage: number
        rowsNumber: number
    }
    onRequest: (props: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => Promise<void>
}

export const useProjectResources = () => {
    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const { t } = useI18n()

    const libraryIdSelected = ref<string>('')
    const librariesOptions = computed(() => {
        return [...projectStore.libraries, { name: t('common.all'), id: '' }]
    })

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
            },
            {
                name: 'status',
                label: t('project.resources.status'),
                align: 'left',
                field: 'status',
            },
        ],
        pagination: reactive({
            sortBy: 'name',
            descending: false,
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 0,
        }),
        onRequest: async (props: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
            const resourceStore = useResourceStore()
            await resourceStore.fetchResources(libraryIdSelected.value, { props, table })
        },
    }

    const selectDefaultLibrary = () => {
        if (!userStore.user?.id) {
            libraryIdSelected.value = ''
            return
        }

        const librariesIdWhereUserIsInstructor = projectStore.roles
            .filter((el) => el.user.id === userStore.user?.id && el.role === 'instructor')
            .map((el) => el.libraryId)

        libraryIdSelected.value = librariesIdWhereUserIsInstructor[0] || ''
    }

    const resourceDialog = ref<boolean>(false)
    const resourceIdSelected = ref<string>('')

    const onRowClick = (_: Event, row: Resource) => {
        resourceIdSelected.value = row.id
        resourceDialog.value = true
    }

    return {
        libraryIdSelected,
        librariesOptions,
        selectDefaultLibrary,
        table,
        resourceDialog,
        resourceIdSelected,
        onRowClick,
    }
}
