import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Segment } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'

export const useAnomalyStore = defineStore('anomalyStore', () => {
    const resourceStore = useResourceStore()
    const anomalyAddForSegment = ref<string[]>([])

    const onActionOnAnomaly = (
        props: { expand: boolean; row: Segment },
        option?: 'cancelAddAnomaly' | 'addAnomalySelection' | 'anomalyAdded' | 'deleteAnomaly',
    ) => {
        const segmentAnomalies = resourceStore.anomalies.filter((anomaly) => anomaly.segment.id === props.row.id)

        if (option === 'addAnomalySelection') {
            props.expand = true
            if (!anomalyAddForSegment.value.find((el) => el === props.row.id)) {
                anomalyAddForSegment.value.push(props.row.id)
            }
        }

        if (option === 'anomalyAdded') {
            props.expand = true
            const index = anomalyAddForSegment.value.indexOf(props.row.id)
            if (index !== -1) anomalyAddForSegment.value.splice(index, 1)
        }

        if (option === 'cancelAddAnomaly') {
            props.expand = false
            const index = anomalyAddForSegment.value.indexOf(props.row.id)
            if (index !== -1) anomalyAddForSegment.value.splice(index, 1)
        }

        if (option === 'deleteAnomaly') {
            if (
                !segmentAnomalies.filter((el) => !el.fixed).length &&
                !anomalyAddForSegment.value.find((el) => el === props.row.id)
            )
                props.expand = false
        }
    }

    return {
        anomalyAddForSegment,
        onActionOnAnomaly,
    }
})
