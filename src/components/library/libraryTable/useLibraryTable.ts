import type { QTableProps } from 'quasar'
import type { Library } from '#/library.ts'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

export const useLibraryTable = () => {
    const { t } = useI18n()

    const loading = ref<boolean>(false)
    const filter = ref<string>('')

    const defaultColumns: QTableProps['columns'] = [
        {
            name: 'name',
            required: true,
            label: t('libraries.add.fields.name'),
            align: 'left',
            field: (row: Library) => row.name,
            sortable: true,
        },
        {
            name: 'alias',
            required: true,
            label: t('libraries.add.fields.alias'),
            align: 'left',
            field: (row: Library) => row.alias,
            sortable: true,
        },
        {
            name: 'code',
            required: true,
            label: t('libraries.add.fields.code'),
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

    return {
        defaultColumns,
        columnsWithActions,
        loading,
        filter,
    }
}
