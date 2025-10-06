<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import type { QTableColumn } from 'quasar'
import { AnomalyType } from '&/project.ts'
import type { Anomaly, Segment } from '#/project.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import { computed, ref } from 'vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t, locale } = useI18n()
const resourceStore = useResourceStore()
const props = defineProps<{
    addAnomaly: boolean
    segment: Segment
}>()
const emit = defineEmits<{
    (e: 'cancelAddAnomaly'): void
}>()
const anomalyType = ref<AnomalyType>()
const anomalyOptions = Object.entries(AnomalyType).map(([_key, value]) => ({
    label: t(`project.anomaly.type.${value.snakeToCamel()}`),
    value,
}))
const anomalyOther = ref<string>()

const anomaliesForSegment = computed(() =>
    resourceStore.anomalies.filter((anomaly) => anomaly.segment.id === props.segment.id),
)

const postAnomaly = async () => {
    if (!anomalyType.value) return
    await resourceStore.postAnomaly(
        props.segment.id,
        anomalyType.value,
        anomalyType.value === AnomalyType.Other ? anomalyOther.value : undefined,
    )

    anomalyType.value = undefined
    emit('cancelAddAnomaly')
}

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
        label: t('project.anomaly.tableField.fix'),
        field: '',
        align: 'right',
    },
]
</script>

<template>
    <QTable
        bordered
        :columns
        flat
        :hide-header="anomaliesForSegment.length === 0"
        hide-no-data
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
        :rows="anomaliesForSegment"
    >
        <template #body-cell-fixed="{ value, row }">
            <QTd>
                {{ value ? '✅' : '❌' }}
                <QTooltip
                    v-if="value"
                    anchor="bottom start"
                    self="bottom start"
                >
                    {{
                        `${t('common.by')} ${row.fixedBy.firstName} ${row.fixedBy.lastName} | ${t('common.the')} ${new Intl.DateTimeFormat(locale).format(new Date(row.fixedAt))}`
                    }}
                </QTooltip>
            </QTd>
        </template>
        <template #body-cell-createdAt="{ value, row }">
            <QTd>
                {{ new Intl.DateTimeFormat(locale).format(new Date(value)) }}
                <QTooltip
                    anchor="bottom start"
                    self="bottom start"
                >
                    {{ `${t('common.by')} ${row.createdBy.firstName} ${row.createdBy.lastName}` }}
                </QTooltip>
            </QTd>
        </template>
        <template #body-cell-fix="{ row }">
            <QTd auto-width>
                <AtomicButton
                    v-if="!row.fixed"
                    :label="t('project.anomaly.fixBtn')"
                    @click="resourceStore.fixAnomaly(row.id)"
                />
            </QTd>
        </template>
        <template
            v-if="addAnomaly"
            #bottom-row
        >
            <QTd colspan="100">
                <QForm
                    class="add-anomaly"
                    @submit="postAnomaly"
                >
                    <div>
                        <AtomicSelect
                            v-model="anomalyType"
                            dense
                            emit-value
                            :label="t('project.anomaly.tableField.type')"
                            map-options
                            option-label="label"
                            option-value="value"
                            :options="anomalyOptions"
                            :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
                        />
                        <AtomicInput
                            v-if="anomalyType === AnomalyType.Other"
                            v-model="anomalyOther"
                            dense
                            :label="t('common.description').capitalize()"
                            :rules="[
                                (val: string) =>
                                    (anomalyType === AnomalyType.Other && !!val) || t('forms.fieldIsRequired'),
                            ]"
                        />
                    </div>
                    <div>
                        <AtomicButton
                            :label="t('common.cancel')"
                            @click="emit('cancelAddAnomaly')"
                        />
                        <AtomicButton
                            color="primary"
                            :label="t('common.save')"
                            no-border
                            type="submit"
                        />
                    </div>
                </QForm>
            </QTd>
        </template>
    </QTable>
</template>

<style lang="sass" scoped>
.add-anomaly
    display: flex
    justify-content: space-between
    align-items: start

    > :first-child
        display: flex
        flex-grow: 1
        gap: 1rem

        > .q-select
            width: fit-content
            min-width: 200px
    > :nth-child(2)
        display: flex
        gap: 0.5rem
</style>
