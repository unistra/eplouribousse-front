import type { QTable, QTableProps } from 'quasar'
import type { Library } from '#/library.ts'
import { useI18n } from 'vue-i18n'
import { ref, useTemplateRef, watch } from 'vue'
import { useLibraryStore } from '@/stores/libraryStore.ts'
import { storeToRefs } from 'pinia'

export const useLibraryTable = () => {
    const { t } = useI18n()
    const { libraries } = storeToRefs(useLibraryStore())
    const { fetchLibraries } = useLibraryStore()

    const tableRef = useTemplateRef<QTable>('qTable')

    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const pagination = ref({
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
    })

    watch(
        () => libraries.value.count,
        (newCount) => {
            pagination.value.rowsNumber = newCount
        },
        { immediate: true },
    )

    const defaultColumns: QTableProps['columns'] = [
        {
            name: 'name',
            required: true,
            label: t('libraries.form.fields.name'),
            align: 'left',
            field: (row: Library) => row.name,
            sortable: true,
        },
        {
            name: 'alias',
            required: true,
            label: t('libraries.form.fields.alias'),
            align: 'left',
            field: (row: Library) => row.alias,
            sortable: true,
        },
        {
            name: 'code',
            required: true,
            label: t('libraries.form.fields.code'),
            align: 'left',
            field: (row: Library) => row.code,
        },
    ]
    const columnsWithActions: QTableProps['columns'] = [
        {
            name: 'menu',
            label: '',
            align: 'left',
            field: () => null,
        },
        ...defaultColumns,
    ]
    const columnsWithAddBtn: QTableProps['columns'] = [
        {
            name: 'addBtn',
            label: '',
            align: 'left',
            field: () => null,
        },
        ...defaultColumns,
    ]

    const onRequest = async (props: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
        const { page, rowsPerPage, sortBy, descending } = props.pagination
        const filterValue = props.filter

        loading.value = true

        try {
            await fetchLibraries({
                page,
                pageSize: rowsPerPage,
                sortBy: (sortBy as 'name' | 'alias') || 'name',
                descending,
                filter: filterValue,
            })

            pagination.value.page = page
            pagination.value.rowsPerPage = rowsPerPage
            pagination.value.sortBy = sortBy || 'name'
            pagination.value.descending = descending
        } catch (error) {
            console.error('Failed to fetch libraries', error)
        } finally {
            loading.value = false
        }
    }

    return {
        defaultColumns,
        columnsWithActions,
        columnsWithAddBtn,
        loading,
        filter,
        rows,
        pagination,
        onRequest,
        tableRef,
    }
}
