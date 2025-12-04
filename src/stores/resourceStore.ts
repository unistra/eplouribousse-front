import { defineStore } from 'pinia'
import {
    type Anomaly,
    type CollectionsInResource,
    type Resource,
    type Segment,
    type SegmentNoCollection,
} from '#/project.ts'
import { AnomalyType, ResourceStatus } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import i18n from '@/plugins/i18n'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { computed, ref } from 'vue'
import { useUtils } from '@/composables/useUtils.ts'

const { t } = i18n.global

export const useResourceStore = defineStore('resource', () => {
    const { useHandleError } = useUtils()

    // RESOURCE RELATED ================
    // STATE
    const resource = ref<Resource>()
    const initialResource = ref<Resource>()

    // COLLECTION RELATED ================
    // STATE
    const collections = ref<CollectionsInResource[]>([])

    // GETTERS
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

    // SEGMENTS RELATED ================
    const segments = ref<Segment[]>([])

    // ANOMALIES RELATED ================
    const anomalies = ref<Anomaly[]>([])

    const anomaliesUnfixed = computed<Anomaly[]>(() => {
        if (!resource.value) return []
        return anomalies.value.filter((anomaly) => !anomaly.fixed)
    })

    // ====================================================================================

    // GETTERS
    const statusName = computed<'boundCopies' | 'unboundCopies'>(() => {
        if (!resource.value) return 'boundCopies'
        return resource.value.status <= ResourceStatus.ControlBound ? 'boundCopies' : 'unboundCopies'
    })

    // ACTIONS

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
        segments,
        anomalies,
        // GETTERS
        statusName,
        anomaliesUnfixed,
        collectionsSortedByOrderInInstructionTurns,
        // ACTIONS
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
