import { defineStore } from 'pinia'
import {
    type Anomaly,
    type CollectionsInResource,
    type CollectionsWithResource,
    type Resource,
    type Segment,
} from '#/project.ts'
import { computed, ref } from 'vue'
import { ResourceStatus } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'

export const useResourceStore = defineStore('resource', () => {
    const { useHandleError } = useUtils()
    const { t } = useI18n()
    const projectStore = useProjectStore()

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
        return collection
            ? `${t('fn.collection.fields.position.short')} ${collection.position} | ${collection.callNumber}`
            : ''
    }

    const getResourceAndRelatedCollections = async (resourceIdSelected: string) => {
        try {
            const response = await axiosI.get<CollectionsWithResource>(
                `/resources/${resourceIdSelected}/collections/`,
                {
                    params: {
                        project_id: projectStore.project?.id,
                    },
                },
            )

            resource.value = response.data.resource
            collections.value = response.data.collections
        } catch (e) {
            useHandleError(e)
        }
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
        getResourceAndRelatedCollections,
        getSegments,
    }
})
