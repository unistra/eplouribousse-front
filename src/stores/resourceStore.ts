import { defineStore } from 'pinia'
import {
    type Anomaly,
    type CollectionsInResource,
    type CollectionsWithResource,
    type CommentPositioning,
    type Resource,
    type Segment,
    type SegmentNoCollection,
} from '#/project.ts'
import { AnomalyType, Arbitration, CollectionPosition, ResourceStatus } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import i18n from '@/plugins/i18n'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { computed, ref } from 'vue'
import { useUtils } from '@/composables/useUtils.ts'

const { t } = i18n.global

interface CollectionPositionAndExcludeResponse {
    arbitration: Arbitration
    status: ResourceStatus
    shouldInstruct: boolean
    shouldPosition: boolean
}

interface UpdateCollectionPositionResponse extends CollectionPositionAndExcludeResponse {
    position: CollectionPosition
}

interface ExcludeCollectionResponse extends CollectionPositionAndExcludeResponse {
    exclusionReason: string
}

export const useResourceStore = defineStore('resource', () => {
    const resourcesStore = useResourcesStore()
    const { useHandleError } = useUtils()

    // STATE
    const resource = ref<Resource>()
    const initialResource = ref<Resource>()

    const collections = ref<CollectionsInResource[]>([])
    const resourcesNumber = ref<number>(0)

    const segments = ref<Segment[]>([]) // TODO: Move to specific store
    const anomalies = ref<Anomaly[]>([]) // TODO: Move to specific store

    // GETTERS
    const statusName = computed<'boundCopies' | 'unboundCopies'>(() => {
        if (!resource.value) return 'boundCopies'
        return resource.value.status <= ResourceStatus.ControlBound ? 'boundCopies' : 'unboundCopies'
    })

    const anomaliesUnfixed = computed<Anomaly[]>(() => {
        if (!resource.value) return []
        return anomalies.value.filter((anomaly) => !anomaly.fixed)
    })

    const collectionsSortedByOrderInInstructionTurns = computed(() => {
        if (
            !resource.value ||
            !resource.value.instructionTurns ||
            !resource.value.instructionTurns.turns ||
            !collections.value
        ) {
            return []
        }
        const turns = resource.value?.instructionTurns.turns
        return turns
            .map((turn) => collections.value.find((collection) => collection.id === turn.collection))
            .filter((item): item is (typeof collections.value)[0] => item !== undefined)
    })

    // ACTIONS
    const _findCollection = (collectionId: string) => {
        const collection = collections.value.find((col) => col.id === collectionId)
        if (!collection) throw new Error('collection does not exist')
        return collection
    }

    const _applyResourceUpdate = (response: CollectionPositionAndExcludeResponse) => {
        const resourcesStore = useResourcesStore()
        if (!resource.value) throw new Error('no resource')

        resource.value.arbitration = response.arbitration
        resource.value.status = response.status
        resource.value.shouldPosition = response.shouldPosition
        resource.value.shouldInstruct = response.shouldInstruct

        const resourceInResources = resourcesStore.resources.find((el) => el.id === resource.value?.id)
        if (resourceInResources) {
            resourceInResources.arbitration = response.arbitration
            resourceInResources.status = response.status
            resourceInResources.shouldPosition = response.shouldPosition
            resourceInResources.shouldInstruct = response.shouldInstruct
        }
    }

    const fetchResourceAndCollections = async (resourceId: string) => {
        const projectStore = useProjectStore()

        try {
            const response = await axiosI.get<CollectionsWithResource>(`/resources/${resourceId}/collections/`, {
                params: {
                    project_id: projectStore.project?.id,
                },
            })

            resource.value = response.data.resource

            collections.value = response.data.collections.sort((a: CollectionsInResource, b: CollectionsInResource) => {
                if (!resourcesStore.libraryIdSelected) return 0
                const aMatch = a.library === resourcesStore.libraryIdSelected
                const bMatch = b.library === resourcesStore.libraryIdSelected
                return bMatch ? (aMatch ? 0 : 1) : aMatch ? -1 : 0
            })
        } catch (e) {
            useHandleError(e)
        }
    }

    const updatePosition = async (collectionId: string, newPosition: CollectionPosition) => {
        try {
            const response = await axiosI.patch<UpdateCollectionPositionResponse>(
                `collections/${collectionId}/position/`,
                {
                    position: newPosition,
                },
            )

            const collection = _findCollection(collectionId)
            collection.position = response.data.position
            collection.exclusionReason = ''

            _applyResourceUpdate({
                arbitration: response.data.arbitration,
                status: response.data.status,
                shouldPosition: response.data.shouldPosition,
                shouldInstruct: response.data.shouldInstruct,
            })
        } catch (e) {
            useHandleError(e)
        }
    }
    const excludeCollection = async (collectionId: string, exclusionReason: string) => {
        try {
            const response = await axiosI.patch<ExcludeCollectionResponse>(`collections/${collectionId}/exclude/`, {
                exclusion_reason: exclusionReason,
            })
            const collection = _findCollection(collectionId)
            collection.position = CollectionPosition.Excluded
            collection.exclusionReason = response.data.exclusionReason

            _applyResourceUpdate({
                arbitration: response.data.arbitration,
                status: response.data.status,
                shouldPosition: response.data.shouldPosition,
                shouldInstruct: response.data.shouldInstruct,
            })
        } catch (e) {
            useHandleError(e)
        }
    }
    const commentPositioning = async (collectionId: string, content: string) => {
        try {
            const collection = _findCollection(collectionId)

            const method = collection.commentPositioning?.id ? 'patch' : 'post'
            const response = await axiosI[method]<CommentPositioning>(
                `collections/${collectionId}/comment-positioning/`,
                { content },
            )

            collection.commentPositioning = response.data
        } catch (e) {
            useHandleError(e)
        }
    }

    const fetchSegments = async () => {
        try {
            const response = await axiosI.get(`/segments/`, { params: { resource_id: resource.value?.id } })

            segments.value = response.data
        } catch (e) {
            useHandleError(e)
        }
    }
    const orderSegment = async (segment: Segment, direction: 'up' | 'down') => {
        if (direction == 'up' && segment.order === 1) return
        if (direction == 'down' && segment.order === segments.value.length) return

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

            const currentSegment = segments.value.find((el) => el.id === segment.id)
            const targetSegment = segments.value.find(
                (el) =>
                    el.id === (direction === 'up' ? response.data.previousSegment.id : response.data.nextSegment.id),
            )

            if (currentSegment && targetSegment) {
                currentSegment.order = response.data.currentSegment.order
                targetSegment.order =
                    direction === 'up' ? response.data.previousSegment.order : response.data.nextSegment.order
            }
        } catch (e) {
            useHandleError(e)
        }
    }
    const deleteSegment = async (segmentId: string) => {
        try {
            await axiosI.delete(`/segments/${segmentId}/`)
            await fetchSegments()
        } catch (e) {
            useHandleError(e)
        }
    }
    const createSegment = async (segment: SegmentNoCollection, afterSegment?: string) => {
        try {
            const response = await axiosI.post<Segment>('/segments/', {
                content: segment.content,
                ...(segment.improvableElements && { improvable_elements: segment.improvableElements }),
                ...(segment.exception && { exception: segment.exception }),
                ...(segment.improvedSegment && { improved_segment: segment.improvedSegment }),
                collection:
                    resource.value && resource.value.instructionTurns
                        ? resource.value.instructionTurns[statusName.value].turns[0].collection
                        : undefined,
                ...(afterSegment && { after_segment: afterSegment }),
            })
            if (afterSegment) {
                await fetchSegments()
            } else {
                segments.value.push(response.data)
            }
        } catch (e) {
            useHandleError(e)
        }
    }
    const updateSegment = async (segmentId: string, updatedFields: Partial<SegmentNoCollection>) => {
        try {
            const response = await axiosI.patch<Segment>(`/segments/${segmentId}/`, updatedFields)
            const index = segments.value.findIndex((seg) => seg.id === segmentId)
            if (index !== -1) {
                segments.value[index] = response.data
            }
        } catch (e) {
            useHandleError(e)
        }
    }
    const finishTurn = async () => {
        const resourcesStore = useResourcesStore()

        try {
            if (!resource.value?.shouldInstruct || !resource.value?.instructionTurns)
                throw new Error('Instruction is not allowed')
            const collectionId =
                resource.value && resource.value.instructionTurns
                    ? resource.value.instructionTurns[statusName.value].turns[0].collection
                    : undefined

            await axiosI.post<Segment>(`/collections/${collectionId}/finish_turn/`)
            await resourcesStore.getResources({ status: [resource.value?.status] })
        } catch (e) {
            useHandleError(e)
        }
    }
    const fetchAnomalies = async () => {
        try {
            const response = await axiosI.get<Anomaly[]>(`/anomalies/`, {
                params: {
                    resource: resource.value?.id,
                },
            })

            anomalies.value = response.data
        } catch (e) {
            useHandleError(e)
        }
    }
    const postAnomaly = async (segmentId: string, type: string, description?: string) => {
        try {
            const response = await axiosI.post<Anomaly>(`/anomalies/`, {
                segmentId,
                type,
                ...(description && type === AnomalyType.Other && { description }),
            })

            anomalies.value.push(response.data)
            const segment = segments.value.find((el) => el.id === segmentId)
            if (segment) segment.anomalies.unfixed += 1
        } catch (e) {
            useHandleError(e)
        }
    }
    const fixAnomaly = async (id: string) => {
        try {
            const response = await axiosI.patch<Anomaly>(`/anomalies/${id}/fix/`)

            anomalies.value = anomalies.value.map((a) => (a.id === id ? response.data : a))
        } catch (e) {
            useHandleError(e)
        }
    }
    const deleteAnomaly = async (id: string) => {
        try {
            const anomaly = anomalies.value.find((a) => a.id === id)
            await axiosI.delete<Anomaly>(`/anomalies/${id}/`)

            anomalies.value = anomalies.value.filter((a) => a.id !== id)

            const segment = segments.value.find((el) => el.id === anomaly?.segment.id)
            if (segment) segment.anomalies[anomaly?.fixed ? 'fixed' : 'unfixed'] -= 1
        } catch (e) {
            useHandleError(e)
        }
    }
    const declareAnomaly = async () => {
        const resourcesStore = useResourcesStore()
        try {
            await axiosI.patch<Anomaly>(`/resources/${resource.value?.id}/report-anomalies/`)
            await resourcesStore.getResources({ status: [resource.value?.status || ResourceStatus.Positioning] })
        } catch (e) {
            useHandleError(e)
        }
    }
    const validateControl = async () => {
        const resourcesStore = useResourcesStore()
        try {
            await axiosI.post<unknown>(`/resources/${resource.value?.id}/control/`, {
                validation: true,
            })
            await resourcesStore.getResources({ status: [resource.value?.status || ResourceStatus.Positioning] })
        } catch (e) {
            useHandleError(e)
        }
    }

    const formatCollectionToString = (collection: CollectionsInResource | '') => {
        return collection ? `${t('collection.position.short')} ${collection.position} | ${collection.callNumber}` : ''
    }

    return {
        // STATE
        resource,
        initialResource,
        collections,
        resourcesNumber,
        segments,
        anomalies,
        // GETTERS
        statusName,
        anomaliesUnfixed,
        collectionsSortedByOrderInInstructionTurns,
        // ACTIONS
        _findCollection,
        _applyResourceUpdate,
        fetchResourceAndCollections,
        updatePosition,
        excludeCollection,
        commentPositioning,
        fetchSegments,
        orderSegment,
        deleteSegment,
        createSegment,
        updateSegment,
        finishTurn,
        fetchAnomalies,
        postAnomaly,
        fixAnomaly,
        deleteAnomaly,
        declareAnomaly,
        validateControl,
        formatCollectionToString,
    }
})
