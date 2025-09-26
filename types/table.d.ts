import { type Ref, type ShallowRef } from 'vue'
import type { QTable } from 'quasar'
import type { Resource } from './project.ts'

export interface TableProjectResources {
    ref: Readonly<ShallowRef<QTable | null>>
    rows: Ref<Resource[]>
    filter: Ref<string>
    loading: Ref<boolean>
    columns: QTable['columns']
    pagination: Ref<TableProjectResourcePagination>
}

export interface TableProjectResourcePagination {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber: number
}
