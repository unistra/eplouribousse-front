<script setup lang="ts">
import type { Segment } from '#/project.ts'
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import { useI18n } from 'vue-i18n'
import {
    NULL_SEGMENT,
    useProjectSegmentTable,
} from '@/components/project/projectSegmentTable/useProjectSegmentTable.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { onMounted } from 'vue'
import ProjectSegmentTableOptions from '@/components/project/projectSegmentTable/ProjectSegmentTableOptions.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AnomalyTable from '@/components/anomaly/anomalyTable/AnomalyTable.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Tab } from '&/project.ts'
import { useAnomalyStore } from '@/stores/anomalyStore.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const anomalyStore = useAnomalyStore()
const {
    columns,
    loading,
    orderedRows,
    improvedSegmentIdHovered,
    dialogCreateSegment,
    insertAfter,
    openDialogCreateSegment,
    displayOptionsColumnBasedOnUserRole,
    displayNewSegmentButton,
    isHighlightedRow,
    isSemiHighlightedRow,
} = useProjectSegmentTable()

onMounted(async () => {
    loading.value = true
    await resourceStore.getSegments()
    await resourceStore.fetchAnomalies()
    loading.value = false
})
</script>

<template>
    <QTable
        :class="['table', { 'virtual-scroll': projectStore.tab !== Tab.Edition }]"
        :columns
        flat
        hide-pagination
        :loading
        :no-data-label="t('project.instruction.segment.noSegment')"
        :pagination="{ rowsPerPage: 0 }"
        row-key="id"
        :rows="orderedRows"
        :table-row-class-fn="(row: Segment) => (improvedSegmentIdHovered === row.id ? 'resolved' : '')"
        :virtual-scroll="projectStore.tab !== Tab.Edition"
    >
        <template #body="props">
            <QTr
                :class="{
                    highlighted: isHighlightedRow(props.row.collection),
                    'semi-highlighted': isSemiHighlightedRow(props.row.improvedSegment),
                    hatched: props.row.content === NULL_SEGMENT,
                }"
                :props="props"
            >
                <QTd
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                >
                    <template v-if="col.name === 'options' && displayOptionsColumnBasedOnUserRole(props.row)">
                        <ProjectSegmentTableOptions
                            v-if="props.row.content !== NULL_SEGMENT"
                            :open-dialog-create-segment
                            :row="props.row"
                            @add-anomaly="anomalyStore.onActionOnAnomaly(props, 'addAnomalySelection')"
                        />
                        <QIcon
                            v-else
                            name="mdi-lock-outline"
                            size="1.2rem"
                        />
                    </template>
                    <template v-else-if="col.name === 'resolve'">
                        <div
                            class="resolve"
                            @mouseenter="improvedSegmentIdHovered = props.row.improvedSegment"
                            @mouseleave="improvedSegmentIdHovered = null"
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
                        :segment="props.row"
                        @add-anomaly="anomalyStore.onActionOnAnomaly(props, 'anomalyAdded')"
                        @cancel-add-anomaly="anomalyStore.onActionOnAnomaly(props, 'cancelAddAnomaly')"
                        @delete-anomaly="anomalyStore.onActionOnAnomaly(props, 'deleteAnomaly')"
                    />
                </QTd>
            </QTr>
        </template>

        <template
            v-if="displayNewSegmentButton"
            #bottom
        >
            <QTr class="bottom">
                <AtomicButton
                    class="btn-segment"
                    :disable="
                        !!resourceStore.anomaliesUnfixed.length &&
                        (projectStore.tab === Tab.InstructionBound || projectStore.tab === Tab.InstructionUnbound)
                    "
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
            v-if="resourceStore.resource?.shouldInstruct && projectStore.userIsInstructorForLibrarySelected"
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
    &.virtual-scroll
        flex-grow: 1
        height: 0
    .resolve
        text-align: center

    .forbidden
        text-align: right

:deep(.resolved)
    background-color: var(--color-neutral-300)

    &.highlighted
        background-color: var(--color-neutral-500)
:deep(.semi-highlighted)
    background-color: var(--epl-color-light-green)
    font-weight: bold

:deep(.hatched)
    background: repeating-linear-gradient(-45deg, white, white 1rem, var(--color-neutral-200) 1rem, var(--color-neutral-200) 1.5rem)

.btn-segment
    width: fit-content

.no-data
        display: flex
        justify-content: space-between
        align-items: center
        width: 100%

.bottom
    margin-left: auto

.highlighted
    background-color: var(--epl-color-light-blue)
    font-weight: bold
</style>
