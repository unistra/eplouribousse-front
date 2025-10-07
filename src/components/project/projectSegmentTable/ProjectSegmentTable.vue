<script setup lang="ts">
import type { Segment } from '#/project.ts'
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import { useI18n } from 'vue-i18n'
import { useProjectSegmentTable } from '@/components/project/projectSegmentTable/useProjectSegmentTable.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { onMounted } from 'vue'
import ProjectSegmentTableOptions from '@/components/project/projectSegmentTable/ProjectSegmentTableOptions.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AnomalyTable from '@/components/anomaly/anomalyTable/AnomalyTable.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Tab } from '&/project.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const {
    columns,
    loading,
    orderedRows,
    hoveredValue,
    dialogCreateSegment,
    insertAfter,
    openDialogCreateSegment,
    addAnomaly,
    onActionOnAnomaly,
    displayOptionsColumnBasedOnUserRole,
    checkIfSegmentTypeIsSameAsInstructionTab,
} = useProjectSegmentTable()

onMounted(async () => {
    loading.value = true
    await resourceStore.fetchSegments()
    await resourceStore.fetchAnomalies()
    loading.value = false
})
</script>

<template>
    <QTable
        class="table"
        :columns
        flat
        hide-pagination
        :loading
        :no-data-label="t('project.instruction.segment.noSegment')"
        :pagination="{ rowsPerPage: 0 }"
        row-key="id"
        :rows="orderedRows"
        :table-row-class-fn="(row: Segment) => (hoveredValue === row.order.toString() ? 'resolved' : '')"
        virtual-scroll
    >
        <template #body="props">
            <QTr :props="props">
                <QTd
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                >
                    <template
                        v-if="
                            col.name === 'options' &&
                            displayOptionsColumnBasedOnUserRole &&
                            checkIfSegmentTypeIsSameAsInstructionTab(props.row)
                        "
                    >
                        <ProjectSegmentTableOptions
                            :open-dialog-create-segment
                            :row="props.row"
                            @add-anomaly="onActionOnAnomaly(props, { addAnomaly: true })"
                        />
                    </template>
                    <template v-else-if="col.name === 'resolve'">
                        <div
                            class="resolve"
                            @mouseenter="hoveredValue = col.value"
                            @mouseleave="hoveredValue = null"
                        >
                            {{ col.value }}
                        </div>
                    </template>
                    <template v-else-if="col.name === 'anomalies'">
                        <AtomicButton
                            :disable="props.row.anomalies.unfixed === 0"
                            :icon="
                                props.row.anomalies.unfixed === 0
                                    ? ''
                                    : props.expand
                                      ? 'mdi-chevron-up'
                                      : 'mdi-chevron-down'
                            "
                            :label="props.row.anomalies.unfixed.toString()"
                            no-border
                            @click="props.expand = !props.expand"
                        >
                            <QTooltip>
                                {{ props.row.anomalies.unfixed }} {{ t('project.anomaly.unfixed').toLowerCase() }} |
                                {{ props.row.anomalies.fixed }} {{ t('project.anomaly.fixed').toLowerCase() }}
                            </QTooltip>
                        </AtomicButton>
                    </template>
                    <template v-else> {{ col.value }} </template>
                </QTd>
            </QTr>
            <QTr
                v-show="props.expand"
                :props="props"
            >
                <QTd colspan="100%">
                    <AnomalyTable
                        :add-anomaly="addAnomaly"
                        :segment="props.row"
                        @add-anomaly="onActionOnAnomaly(props, { anomalyAdded: true })"
                        @cancel-add-anomaly="onActionOnAnomaly(props, { cancelAddAnomaly: true })"
                        @delete-anomaly="onActionOnAnomaly(props)"
                    />
                </QTd>
            </QTr>
        </template>

        <template
            v-if="
                (resourceStore.shouldInstruct &&
                    projectStore.userIsInstructorForLibrarySelected &&
                    projectStore.tab === Tab.InstructionBound) ||
                projectStore.tab === Tab.InstructionUnbound
            "
            #bottom
        >
            <QTr class="bottom">
                <AtomicButton
                    class="btn-segment"
                    :disable="!!resourceStore.anomaliesUnfixed.length"
                    icon="mdi-plus"
                    :label="t('project.instruction.segment.new')"
                    no-border
                    @click="openDialogCreateSegment()"
                >
                    <QTooltip
                        v-if="!!resourceStore.anomalies.length"
                        :delay="1000"
                        >{{ t('project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                    >
                </AtomicButton>
            </QTr>
        </template>
        <template
            v-if="resourceStore.shouldInstruct && projectStore.userIsInstructorForLibrarySelected"
            #no-data="{ message }"
        >
            <div class="no-data">
                <p>
                    <QIcon
                        name="mdi-alert"
                        size="1.4rem"
                    />{{ message }}
                </p>
                <AtomicButton
                    class="btn-segment"
                    icon="mdi-plus"
                    :label="t('project.instruction.segment.new')"
                    no-border
                    @click="openDialogCreateSegment()"
                />
            </div>
        </template>
    </QTable>
    <ProjectInstructionSegmentDialog
        v-model="dialogCreateSegment"
        :insert-after="insertAfter"
        is-new
    />
</template>

<style lang="sass" scoped>
.table
    flex-grow: 1
    height: 0
    .resolve
        text-align: center

    .forbidden
        text-align: right

:deep(.q-table tbody .resolved)
    background-color: var(--color-neutral-300)

.btn-segment
    width: fit-content

.no-data
        display: flex
        justify-content: space-between
        align-items: center
        width: 100%

.bottom
    margin-left: auto
</style>
