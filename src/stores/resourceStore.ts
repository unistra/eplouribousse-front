import { defineStore } from 'pinia'
import {
    type Resource,
    type CollectionsInResource,
    type CollectionsWithResource,
    type ProjectLibrary,
    type CommentPositioning,
} from '#/project.ts'
import { CollectionPosition, Arbitration, ResourceStatus } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Notify, type QTableProps } from 'quasar'
import i18n from '@/plugins/i18n'
import type { Pagination } from '#/pagination.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import type { TableProjectResources } from '#/table'

const { t } = i18n.global

interface ResourceStoreState extends Resource {
    collections: CollectionsInResource[]
    resources: Resource[]
    initialState: Resource
    libraryIdSelected: string
    libraryIdComparedSelected: string
}

const initialState = {
    id: '',
    title: '',
    code: '',
    count: 0,
    callNumbers: '',
    shouldInstruct: false,
    shouldPosition: false,
    status: ResourceStatus.Positioning,
    arbitration: 2,
    acl: {},
}

export const useResourceStore = defineStore('resource', {
    state: (): ResourceStoreState => ({
        ...structuredClone(initialState),
        initialState: structuredClone(initialState),
        collections: [],
        resources: [],
        libraryIdSelected: '',
        libraryIdComparedSelected: '',
    }),
    getters: {
        librariesAssociated(this: ResourceStoreState) {
            const projectStore = useProjectStore()
            return projectStore.libraries
                .filter((lib) => this.collections.some((el: CollectionsInResource) => el.library === lib.id))
                .sort((a: ProjectLibrary, b: ProjectLibrary) => {
                    const aIsSelected = a.id === this.libraryIdSelected
                    const bIsSelected = b.id === this.libraryIdSelected

                    if (aIsSelected === bIsSelected) return 0
                    return aIsSelected ? -1 : 1
                })
        },
    },
    actions: {
        _findCollection(collectionId: string) {
            const collection = this.collections.find((col) => col.id === collectionId)
            if (!collection) throw new Error('collection does not exist')
            return collection
        },
        getAll(table: TableProjectResources) {
            table.pagination.value.rowsNumber = this.resources.length
            return this.resources
        },
        getResourcesWithStatus(table: TableProjectResources, status: ResourceStatus) {
            const resources = this.resources.filter((resource: Resource) => resource.status === status)
            table.pagination.value.rowsNumber = resources.length
            return resources
        },
        getArbitrations(table: TableProjectResources) {
            const resources = this.resources.filter(
                (resource: Resource) =>
                    resource.arbitration === Arbitration.MultiplePosition1 ||
                    resource.arbitration === Arbitration.NoPosition1,
            )
            table.pagination.value.rowsNumber = resources.length
            return resources
        },
        async fetchResourceAndCollections(resourceId: string) {
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
                        if (!this.libraryIdSelected) return 0
                        const aMatch = a.library === this.libraryIdSelected
                        const bMatch = b.library === this.libraryIdSelected
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
            status: ResourceStatus,
            options?: {
                props: Omit<Parameters<NonNullable<QTableProps['onRequest']>>[0], 'getCellValue'>
                table: TableProjectResources
                status?: ResourceStatus
            },
        ) {
            const projectStore = useProjectStore()

            try {
                if (options) options.table.loading.value = true

                const params: Record<string, string | number> = {
                    project: projectStore.id,
                    library: this.libraryIdSelected,
                    status: status,
                }

                if (this.libraryIdComparedSelected && this.libraryIdSelected)
                    params.against = this.libraryIdComparedSelected

                if (options?.props) {
                    const { pagination, filter } = options.props
                    params.page = pagination?.page
                    params.page_size =
                        pagination?.rowsPerPage === 0 ? pagination.rowsNumber || 0 : pagination?.rowsPerPage
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
                const response = await axiosI.patch<{
                    position: CollectionPosition
                    arbitration: Arbitration
                    status: ResourceStatus
                }>(`collections/${collectionId}/position/`, {
                    position: newPosition,
                })

                const collection = this._findCollection(collectionId)
                collection.position = response.data.position
                collection.exclusionReason = ''

                this.arbitration = response.data.arbitration
                this.status = response.data.status
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async excludeCollection(collectionId: string, exclusionReason: string) {
            try {
                const response = await axiosI.patch<{ exclusionReason: string; arbitration: Arbitration }>(
                    `collections/${collectionId}/exclude/`,
                    {
                        exclusion_reason: exclusionReason,
                    },
                )

                const collection = this._findCollection(collectionId)
                collection.position = CollectionPosition.Excluded
                collection.exclusionReason = response.data.exclusionReason
                this.arbitration = response.data.arbitration
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async commentPositioning(collectionId: string, content: string) {
            try {
                const collection = this._findCollection(collectionId)

                const method = collection.commentPositioning?.id ? 'patch' : 'post'
                const response = await axiosI[method]<CommentPositioning>(
                    `collections/${collectionId}/comment-positioning/`,
                    { content },
                )

                collection.commentPositioning = response.data
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
    },
})
