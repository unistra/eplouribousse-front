import { type Ref, type ShallowRef } from 'vue'
import type { QTable, QTableProps } from 'quasar'
import type { Resource } from './project.ts'

export interface TableProjectResources {
    ref: Readonly<ShallowRef<QTable | null>>
    rows: Ref<Resource[]>
    filter: Ref<string>
    loading: Ref<boolean>
    columns: QTable['columns']
    pagination: Ref<TableProjectResourcePagination>
    onRequest: (props: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => Promise<void>
}

export interface TableProjectResourcePagination {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber: number
}
