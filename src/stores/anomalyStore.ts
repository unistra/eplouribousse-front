import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Segment } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'

export const useAnomalyStore = defineStore('anomalyStore', () => {
    const resourceStore = useResourceStore()
    const addAnomalySelection = ref<boolean>(false)

    const onActionOnAnomaly = (
        props: { expand: boolean; row: Segment },
        options?: {
            cancelAddAnomaly?: boolean
            addAnomalySelection?: boolean
            anomalyAdded?: boolean
            deleteAnomaly?: boolean
        },
    ) => {
        const segmentAnomalies = resourceStore.anomalies.filter((anomaly) => anomaly.segment.id === props.row.id)

        if (options?.cancelAddAnomaly || options?.anomalyAdded) {
            addAnomalySelection.value = false
            if (!segmentAnomalies.filter((el) => !el.fixed).length) props.expand = false
        }
        if (options?.addAnomalySelection) addAnomalySelection.value = true

        if (options?.addAnomalySelection || options?.anomalyAdded) {
            props.expand = true
        } else if (!segmentAnomalies.length) {
            props.expand = false
        }

        if (options?.deleteAnomaly) {
            if (!segmentAnomalies.filter((el) => !el.fixed).length) props.expand = false
        }
    }

    return {
        addAnomalySelection,
        onActionOnAnomaly,
    }
})
