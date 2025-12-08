import type { QTableColumn } from 'quasar'
import type { Anomaly, Segment } from '#/project.ts'
import { AnomalyType } from '&/project.ts'
import { computed, ref } from 'vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'

export type AnomalyTableProps = {
    segment: Segment
}

export type AnomalyTableEmits = {
    (e: 'cancelAddAnomaly'): void
    (e: 'deleteAnomaly'): void
    (e: 'addAnomaly'): void
}

export const useAnomalyTable = (props: AnomalyTableProps, emit: AnomalyTableEmits) => {
    const { useHandleError } = useUtils()
    const { t } = useI18n()
    const resourceStore = useResourceStore()

    const anomalyType = ref<AnomalyType>()
    const anomalyOptions = Object.entries(AnomalyType).map(([_key, value]) => ({
        label: t(`project.anomaly.type.${value.snakeToCamel()}`),
        value,
    }))
    const anomalyDescription = ref<string>('')
    const segmentAnomalies = computed(() =>
        resourceStore.anomalies.filter((anomaly) => anomaly.segment.id === props.segment.id),
    )

    // FUNCTIONS
    const postAnomaly = async (segmentId: string, type: string, description?: string) => {
        try {
            const response = await axiosI.post<Anomaly>(`/anomalies/`, {
                segmentId,
                type,
                ...(description && type === AnomalyType.Other && { description }),
            })

            resourceStore.anomalies.push(response.data)
            const segment = resourceStore.segments.find((el) => el.id === segmentId)
            if (segment) segment.anomalies.unfixed += 1
        } catch (e) {
            useHandleError(e)
        }
    }

    const fixAnomaly = async (id: string) => {
        try {
            const response = await axiosI.patch<Anomaly>(`/anomalies/${id}/fix/`)

            resourceStore.anomalies = resourceStore.anomalies.map((a) => (a.id === id ? response.data : a))
        } catch (e) {
            useHandleError(e)
        }
    }

    const deleteAnomaly = async (id: string) => {
        try {
            const anomaly = resourceStore.anomalies.find((a) => a.id === id)
            await axiosI.delete<Anomaly>(`/anomalies/${id}/`)

            resourceStore.anomalies = resourceStore.anomalies.filter((a) => a.id !== id)

            const segment = resourceStore.segments.find((el) => el.id === anomaly?.segment.id)
            if (segment) segment.anomalies[anomaly?.fixed ? 'fixed' : 'unfixed'] -= 1
        } catch (e) {
            useHandleError(e)
        }
    }

    // UTILS
    const onPostAnomaly = async () => {
        if (!anomalyType.value) return
        await postAnomaly(
            props.segment.id,
            anomalyType.value,
            anomalyType.value === AnomalyType.Other ? anomalyDescription.value : undefined,
        )

        anomalyType.value = undefined
        anomalyDescription.value = ''
        emit('addAnomaly')
    }
    const onDeleteAnomaly = async (anomalyId: string) => {
        await deleteAnomaly(anomalyId)
        emit('deleteAnomaly')
    }

    // TABLE RELATED
    const columns: QTableColumn[] = [
        {
            name: 'type',
            label: t('project.anomaly.tableField.type'),
            field: 'type',
            format: (val: string, row: Anomaly) => {
                return val === AnomalyType.Other
                    ? `${t(`project.anomaly.type.other`)}: ${row.description}`
                    : t(`project.anomaly.type.${val.snakeToCamel()}`)
            },
            align: 'left',
        },
        {
            name: 'createdAt',
            label: t('project.anomaly.tableField.createdAt'),
            field: 'createdAt',
            align: 'left',
        },
        {
            name: 'fixed',
            label: t('project.anomaly.tableField.fixed'),
            field: 'fixed',
            align: 'left',
        },
        {
            name: 'fix',
            label: '',
            field: '',
            align: 'right',
        },
    ]

    return {
        emit,
        columns,
        onPostAnomaly,
        onDeleteAnomaly,
        anomalyType,
        anomalyOptions,
        anomalyDescription,
        segmentAnomalies,
        fixAnomaly,
    }
}
