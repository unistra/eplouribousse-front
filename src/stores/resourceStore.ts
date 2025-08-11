import { defineStore } from 'pinia'
import type { Resource, CollectionsInResource, CollectionsWithResource, CollectionPosition } from '#/project'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Notify, type QTableProps } from 'quasar'
import i18n from '@/plugins/i18n'
import type { Pagination } from '#/pagination.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import type { TableProjectResources } from '@/components/project/projectLaunched/useProjectResources.ts'

const { t } = i18n.global

interface ResourceStoreState extends Resource {
    collections: CollectionsInResource[]
    resources: Resource[]
    initialState: Resource
}

const initialState = {
    id: '',
    title: '',
    code: '',
    count: 0,
    callNumbers: '',
    shouldInstruct: false,
    status: 10,
    arbitration: 2,
    acl: {},
}

export const useResourceStore = defineStore('resource', {
    state: (): ResourceStoreState => ({
        ...structuredClone(initialState),
        initialState: structuredClone(initialState),
        collections: [],
        resources: [],
    }),
    getters: {
        librariesAssociated(this: ResourceStoreState) {
            const projectStore = useProjectStore()
            return projectStore.libraries.filter((lib) =>
                this.collections.some((el: CollectionsInResource) => el.library === lib.id),
            )
        },
    },
    actions: {
        async fetchResourceAndCollections(resourceId: string, libraryIdSelected: string) {
            const projectStore = useProjectStore()
            const { notify } = useComposableQuasar()

            try {
                const response = await axiosI.get<CollectionsWithResource>(`/resources/${resourceId}/collections`, {
                    params: {
                        project_id: projectStore.id,
                    },
                })

                this.id = response.data.resource.id
                this.title = response.data.resource.title
                this.code = response.data.resource.code
                this.count = response.data.resource.count
                this.callNumbers = response.data.resource.callNumbers
                this.shouldInstruct = response.data.resource.shouldInstruct
                this.status = response.data.resource.status
                this.arbitration = response.data.resource.arbitration
                this.acl = response.data.resource.acl
                this.collections = response.data.collections

                this.collections = response.data.collections.sort(
                    (a: CollectionsInResource, b: CollectionsInResource) => {
                        if (!libraryIdSelected) return 0
                        const aMatch = a.library === libraryIdSelected
                        const bMatch = b.library === libraryIdSelected
                        return bMatch ? (aMatch ? 0 : 1) : aMatch ? -1 : 0
                    },
                )
            } catch {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async fetchResources(
            libraryIdSelected: string,
            options?: {
                props: Omit<Parameters<NonNullable<QTableProps['onRequest']>>[0], 'getCellValue'>
                table: TableProjectResources
            },
        ) {
            const projectStore = useProjectStore()

            try {
                if (options) options.table.loading.value = true

                const params: Record<string, string | number> = {
                    project: projectStore.id,
                    library: libraryIdSelected,
                }

                if (options?.props) {
                    const { pagination, filter } = options.props
                    params.page = pagination?.page
                    params.page_size = pagination?.rowsPerPage
                    params.search = filter.value

                    if (pagination) {
                        params.ordering = `${pagination.descending ? '-' : ''}${pagination.sortBy || 'name'}`
                    }
                }

                const response = await axiosI.get<Pagination<Resource>>('/resources/', { params })

                this.resources = response.data.results

                if (options?.props?.pagination) {
                    const { pagination } = options.props
                    options.table.pagination.value = {
                        page: pagination.page,
                        rowsPerPage: pagination.rowsPerPage,
                        sortBy: pagination.sortBy || 'name',
                        descending: pagination.descending,
                        rowsNumber: response.data.count,
                    }
                }
                if (options) options.table.pagination.value.rowsNumber = response.data.count
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            } finally {
                if (options) options.table.loading.value = false
            }
        },
        async updatePosition(collectionId: string, newPosition: CollectionPosition) {
            try {
                const response = await axiosI.patch<{ position: CollectionPosition }>(
                    `collections/${collectionId}/position/`,
                    {
                        position: newPosition,
                    },
                )

                const collection = this.collections.find((col) => col.id === collectionId)
                if (!collection) throw new Error('collection does not exist')

                collection.position = response.data.position
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
    },
})
