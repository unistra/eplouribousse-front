<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { AnomalyType, Tab } from '&/project.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import {
    type AnomalyTableEmits,
    type AnomalyTableProps,
    useAnomalyTable,
} from '@/components/anomaly/anomalyTable/useAnomalyTable.ts'
import { useAnomalyStore } from '@/stores/anomalyStore.ts'
import { useUtils } from '@/composables/useUtils.ts'

const { t } = useI18n()
const projectStore = useProjectStore()
const anomalyStore = useAnomalyStore()
const userStore = useUserStore()
const props = defineProps<AnomalyTableProps>()
const emit = defineEmits<AnomalyTableEmits>()

const {
    columns,
    anomalyDescription,
    anomalyOptions,
    onDeleteAnomaly,
    segmentAnomalies,
    onPostAnomaly,
    anomalyType,
    fixAnomaly,
} = useAnomalyTable(props, emit)
</script>

<template>
    <QTable
        bordered
        :columns
        flat
        :hide-header="segmentAnomalies.length === 0"
        hide-no-data
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
        :rows="segmentAnomalies"
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
                        `${t('common.by')} ${row.fixedBy.firstName} ${row.fixedBy.lastName} | ${t('common.the')} ${useUtils().useIntlDateTimeFormat(row.fixedAt)}`
                    }}
                </QTooltip>
            </QTd>
        </template>
        <template #body-cell-createdAt="{ value, row }">
            <QTd>
                {{ useUtils().useIntlDateTimeFormat(value) }}
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
                    v-if="!row.fixed && projectStore.userIsAdmin && projectStore.tab === Tab.Anomalies"
                    :label="t('project.anomaly.fixBtn')"
                    @click="fixAnomaly(row.id)"
                />
                <AtomicButton
                    v-else-if="row.createdBy.id === userStore.user?.id && projectStore.tab !== Tab.Anomalies"
                    icon="mdi-delete-forever-outline"
                    no-border
                    @click="onDeleteAnomaly(row.id)"
                />
            </QTd>
        </template>
        <template
            v-if="anomalyStore.anomalyAddForSegment.find((el) => el === segment.id)"
            #bottom-row
        >
            <QTd colspan="100">
                <QForm
                    class="add-anomaly"
                    @submit="onPostAnomaly"
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
                            :rules="[(val: string) => !!val || t('forms.validation.fieldIsRequired')]"
                        />
                        <AtomicInput
                            v-if="anomalyType === AnomalyType.Other"
                            v-model="anomalyDescription"
                            dense
                            :label="t('common.description').capitalize()"
                            :rules="[
                                (val: string) =>
                                    (anomalyType === AnomalyType.Other && !!val) ||
                                    t('forms.validation.fieldIsRequired'),
                            ]"
                        />
                    </div>
                    <div>
                        <AtomicButton
                            :label="t('common.cancel')"
                            @click="emit('cancelAddAnomaly')"
                        />
                        <AtomicButton
                            :color="!!anomalyType ? 'primary' : undefined"
                            :label="t('common.save')"
                            :no-border="!!anomalyType"
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
    align-items: start
    justify-content: end
    gap: 1rem

    > :first-child
        display: flex
        gap: 1rem

        > .q-select
            width: fit-content
            min-width: 200px
    > :nth-child(2)
        display: flex
        gap: 0.5rem
</style>
