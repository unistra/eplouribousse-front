import { defineStore } from 'pinia'
import { type Anomaly, type CollectionsInResource, type Resource, type Segment } from '#/project.ts'
import i18n from '@/plugins/i18n'
import { computed, ref } from 'vue'
import { ResourceStatus } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'

const { t } = i18n.global

export const useResourceStore = defineStore('resource', () => {
    const { useHandleError } = useUtils()

    // STATE
    const resource = ref<Resource>()
    const initialResource = ref<Resource>()

    const collections = ref<CollectionsInResource[]>([])

    const segments = ref<Segment[]>([])

    const anomalies = ref<Anomaly[]>([])

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

    const anomaliesUnfixed = computed<Anomaly[]>(() => {
        if (!resource.value) return []
        return anomalies.value.filter((anomaly) => !anomaly.fixed)
    })

    const statusName = computed<'boundCopies' | 'unboundCopies'>(() => {
        if (!resource.value) return 'boundCopies'
        return resource.value.status <= ResourceStatus.ControlBound ? 'boundCopies' : 'unboundCopies'
    })

    // ACTIONS
    const formatCollectionToString = (collection: CollectionsInResource | '') => {
        return collection ? `${t('collection.position.short')} ${collection.position} | ${collection.callNumber}` : ''
    }

    const getSegments = async () => {
        try {
            const response = await axiosI.get(`/segments/`, { params: { resource_id: resource.value?.id } })

            segments.value = response.data
        } catch (e) {
            useHandleError(e)
        }
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
        formatCollectionToString,
        getSegments,
    }
})
