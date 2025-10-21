import { defineStore } from 'pinia'
import {
    type Anomaly,
    type CollectionsInResource,
    type CollectionsWithResource,
    type CommentPositioning,
    type ProjectLibrary,
    type Resource,
    type Segment,
    type SegmentNoCollection,
} from '#/project.ts'
import { AnomalyType, Arbitration, CollectionPosition, ResourceStatus } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Notify, type QTableProps } from 'quasar'
import i18n from '@/plugins/i18n'
import type { Pagination } from '#/pagination.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import type { TableProjectResources } from '#/table'

const { t } = i18n.global

interface ResourceStoreState extends Resource {
    collections: CollectionsInResource[]
    resources: Resource[]
    resourcesNumber: number
    initialState: Resource
    libraryIdSelected: string
    libraryIdComparedSelected: string
    page: number
    resourcesCount: number
    segments: Segment[]
    resourceSelected: Resource | null
    anomalies: Anomaly[]
}

const initialState: Resource = {
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
    instructionTurns: undefined,
    issn: '',
    publicationHistory: '',
}

export const useResourceStore = defineStore('resource', {
    state: (): ResourceStoreState => ({
        ...structuredClone(initialState),
        initialState: structuredClone(initialState),
        collections: [],
        resources: [],
        resourcesNumber: 0,
        libraryIdSelected: '',
        libraryIdComparedSelected: '',
        page: 1,
        resourcesCount: 0,
        segments: [],
        resourceSelected: null,
        anomalies: [],
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
        statusName(this: ResourceStoreState): 'boundCopies' | 'unboundCopies' {
            return this.status <= ResourceStatus.ControlBound ? 'boundCopies' : 'unboundCopies'
        },
        anomaliesUnfixed(this: ResourceStoreState): Anomaly[] {
            return this.anomalies.filter((anomaly) => !anomaly.fixed)
        },
    },
    actions: {
        _findCollection(collectionId: string) {
            const collection = this.collections.find((col) => col.id === collectionId)
            if (!collection) throw new Error('collection does not exist')
            return collection
        },
        getAll(table: TableProjectResources) {
            table.pagination.value.rowsNumber = this.resourcesCount
            return this.resources
        },
        async fetchResourceAndCollections(resourceId: string) {
            const projectStore = useProjectStore()

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
                this.instructionTurns = response.data.resource.instructionTurns
                this.issn = response.data.resource.issn
                this.publicationHistory = response.data.resource.publicationHistory

                this.collections = response.data.collections.sort(
                    (a: CollectionsInResource, b: CollectionsInResource) => {
                        if (!this.libraryIdSelected) return 0
                        const aMatch = a.library === this.libraryIdSelected
                        const bMatch = b.library === this.libraryIdSelected
                        return bMatch ? (aMatch ? 0 : 1) : aMatch ? -1 : 0
                    },
                )
            } catch {
                Notify.create({
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
            },
        ) {
            const projectStore = useProjectStore()
            try {
                if (options) options.table.loading.value = true

                const params: Record<string, string | number> = {
                    project: projectStore.id,
                    library:
                        status === ResourceStatus.AnomalyBound || status === ResourceStatus.AnomalyUnbound
                            ? ''
                            : this.libraryIdSelected,
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
                this.resourcesCount = response.data.count

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
                if (options) {
                    options.table.pagination.value.rowsNumber = response.data.count
                }
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
        async fetchSegments() {
            try {
                const response = await axiosI.get(`/segments/`, { params: { resource_id: this.id } })

                this.segments = response.data
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async orderSegment(segment: Segment, direction: 'up' | 'down') {
            if (direction == 'up' && segment.order === 1) return
            if (direction == 'down' && segment.order === this.segments.length) return

            try {
                const response = await axiosI.patch<{
                    currentSegment: {
                        id: string
                        order: number
                    }
                    previousSegment: {
                        id: string
                        order: number
                    }
                    nextSegment: {
                        id: string
                        order: number
                    }
                }>(`/segments/${segment.id}/${direction}/`)

                const currentSegment = this.segments.find((el) => el.id === segment.id)
                const targetSegment = this.segments.find(
                    (el) =>
                        el.id ===
                        (direction === 'up' ? response.data.previousSegment.id : response.data.nextSegment.id),
                )

                if (currentSegment && targetSegment) {
                    currentSegment.order = response.data.currentSegment.order
                    targetSegment.order =
                        direction === 'up' ? response.data.previousSegment.order : response.data.nextSegment.order
                }
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async deleteSegment(segmentId: string) {
            try {
                await axiosI.delete(`/segments/${segmentId}/`)
                await this.fetchSegments()
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async createSegment(segment: SegmentNoCollection, afterSegment?: string) {
            try {
                const response = await axiosI.post<Segment>('/segments/', {
                    content: segment.content,
                    ...(segment.improvableElements && { improvable_elements: segment.improvableElements }),
                    ...(segment.exception && { exception: segment.exception }),
                    ...(segment.improvedSegment && { improved_segment: segment.improvedSegment }),
                    collection: this.instructionTurns?.[this.statusName].turns[0].collection,
                    ...(afterSegment && { after_segment: afterSegment }),
                })
                if (afterSegment) {
                    await this.fetchSegments()
                } else {
                    this.segments.push(response.data)
                }
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async updateSegment(segmentId: string, updatedFields: Partial<SegmentNoCollection>) {
            try {
                const response = await axiosI.patch<Segment>(`/segments/${segmentId}/`, updatedFields)
                const index = this.segments.findIndex((seg) => seg.id === segmentId)
                if (index !== -1) {
                    this.segments[index] = response.data
                }
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async finishTurn() {
            try {
                if (!this.shouldInstruct || !this.instructionTurns) throw new Error('Instruction is not allowed')
                const collectionId = this.instructionTurns[this.statusName].turns[0].collection

                await axiosI.post<Segment>(`/collections/${collectionId}/finish_turn/`)
                await this.fetchResources(this.status)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async fetchAnomalies() {
            try {
                const response = await axiosI.get<Anomaly[]>(`/anomalies/`, {
                    params: {
                        resource: this.id,
                    },
                })

                this.anomalies = response.data
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async postAnomaly(segmentId: string, type: string, description?: string) {
            try {
                const response = await axiosI.post<Anomaly>(`/anomalies/`, {
                    segmentId,
                    type,
                    ...(description && type === AnomalyType.Other && { description }),
                })

                this.anomalies.push(response.data)
                const segment = this.segments.find((el) => el.id === segmentId)
                if (segment) segment.anomalies.unfixed += 1
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async fixAnomaly(id: string) {
            try {
                const response = await axiosI.patch<Anomaly>(`/anomalies/${id}/fix/`)

                this.anomalies = this.anomalies.map((a) => (a.id === id ? response.data : a))
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async deleteAnomaly(id: string) {
            try {
                const anomaly = this.anomalies.find((a) => a.id === id)
                await axiosI.delete<Anomaly>(`/anomalies/${id}/`)

                this.anomalies = this.anomalies.filter((a) => a.id !== id)

                const segment = this.segments.find((el) => el.id === anomaly?.segment.id)
                if (segment) segment.anomalies[anomaly?.fixed ? 'fixed' : 'unfixed'] -= 1
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async declareAnomaly() {
            try {
                await axiosI.patch<Anomaly>(`/resources/${this.id}/report-anomalies/`)
                await this.fetchResources(this.status)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
        async validateControl() {
            try {
                await axiosI.post<unknown>(`/resources/${this.id}/control/`, {
                    validation: true,
                })
                await this.fetchResources(this.status)
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        },
    },
})
