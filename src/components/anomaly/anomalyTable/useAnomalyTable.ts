import type { QTableColumn } from 'quasar'
import type { Anomaly, Segment } from '#/project.ts'
import { AnomalyType } from '&/project.ts'
import { computed, ref } from 'vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'

export type AnomalyTableProps = {
    segment: Segment
}

export type AnomalyTableEmits = {
    (e: 'cancelAddAnomaly'): void
    (e: 'deleteAnomaly'): void
    (e: 'addAnomaly'): void
}

export const useAnomalyTable = (props: AnomalyTableProps, emit: AnomalyTableEmits) => {
    const resourceStore = useResourceStore()
    const { t } = useI18n()

    const anomalyType = ref<AnomalyType>()
    const anomalyOptions = Object.entries(AnomalyType).map(([_key, value]) => ({
        label: t(`project.anomaly.type.${value.snakeToCamel()}`),
        value,
    }))
    const anomalyDescription = ref<string>('')
    const segmentAnomalies = computed(() =>
        resourceStore.anomalies.filter((anomaly) => anomaly.segment.id === props.segment.id),
    )

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

    const onPostAnomaly = async () => {
        if (!anomalyType.value) return
        await resourceStore.postAnomaly(
            props.segment.id,
            anomalyType.value,
            anomalyType.value === AnomalyType.Other ? anomalyDescription.value : undefined,
        )

        anomalyType.value = undefined
        anomalyDescription.value = ''
        emit('addAnomaly')
    }

    const onDeleteAnomaly = async (anomalyId: string) => {
        await resourceStore.deleteAnomaly(anomalyId)
        emit('deleteAnomaly')
    }

    return {
        emit,
        columns,
        onPostAnomaly,
        onDeleteAnomaly,
        anomalyType,
        anomalyOptions,
        anomalyDescription,
        segmentAnomalies,
    }
}
