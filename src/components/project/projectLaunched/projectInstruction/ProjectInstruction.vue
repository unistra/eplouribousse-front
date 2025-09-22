<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import { onMounted } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useProjectInstruction } from '@/components/project/projectLaunched/projectInstruction/useProjectInstruction.ts'
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import AtomicConfirmationDialog from '@/components/atomic/AtomicConfirmationDialog.vue'
import type { Segment } from '#/project.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const {
    columns,
    orderedRows,
    orderSegment,
    tableLoading,
    dialogUpdateSegment,
    dialogCreateSegment,
    deleteSegmentModal,
    insertAfter,
    openDialogCreateSegment,
    turnsWithNames,
    hoveredValue,
} = useProjectInstruction()

onMounted(async () => {
    tableLoading.value = true
    await resourceStore.fetchSegments()
    tableLoading.value = false
})
</script>

<template>
    <div class="turns">
        <p>{{ t('project.instruction.turns') }}:</p>
        <p
            v-for="(turn, index) in turnsWithNames"
            :key="index"
        >
            {{ turn.library + (index + 1 === turnsWithNames?.length ? '' : ',') }}

            <QTooltip> {{ turn.collection }} </QTooltip>
        </p>
    </div>
    <QTable
        :columns="columns"
        flat
        hide-pagination
        :loading="tableLoading"
        :no-data-label="t('project.instruction.segment.noSegment')"
        :pagination="{ rowsPerPage: 0 }"
        row-key="id"
        :rows="orderedRows"
        :table-row-class-fn="(row: Segment) => (hoveredValue === row.order.toString() ? 'resolved' : '')"
    >
        <template #body-cell-resolve="{ value }: { value: string }">
            <QTd
                @mouseenter="hoveredValue = value"
                @mouseleave="hoveredValue = null"
            >
                {{ value }}
            </QTd>
        </template>
        <template #body-cell-options="{ row }: { row: Segment }">
            <QTd class="options">
                <div class="order">
                    <AtomicButton
                        :class="{ opacity: row.order === 1 }"
                        icon="mdi-chevron-up"
                        no-border
                        size="sm"
                        @click="orderSegment(row, 'up')"
                    />
                    <AtomicButton
                        :class="{
                            opacity: row.order === resourceStore.segments.length || resourceStore.segments.length === 1,
                        }"
                        icon="mdi-chevron-down"
                        no-border
                        size="sm"
                        @click="orderSegment(row, 'down')"
                    />
                </div>
                <AtomicButton
                    icon="mdi-dots-vertical"
                    no-border
                    size="sm"
                >
                    <QMenu>
                        <QList>
                            <QItem
                                clickable
                                @click="dialogUpdateSegment = true"
                            >
                                <QItemSection avatar>
                                    <QIcon name="mdi-pencil" />
                                </QItemSection>
                                <QItemSection>
                                    <QItemLabel>{{ t('common.update') }}</QItemLabel>
                                </QItemSection>
                            </QItem>
                            <ProjectInstructionSegmentDialog
                                v-model="dialogUpdateSegment"
                                :is-new="false"
                                :segment="row"
                            />
                            <QItem
                                clickable
                                @click="deleteSegmentModal = true"
                            >
                                <QItemSection avatar>
                                    <QIcon name="mdi-delete-forever" />
                                </QItemSection>
                                <QItemSection>
                                    <QItemLabel>{{ t('common.delete') }}</QItemLabel>
                                </QItemSection>
                            </QItem>
                            <AtomicConfirmationDialog
                                v-model="deleteSegmentModal"
                                @confirm="resourceStore.deleteSegment(row.id)"
                            />
                            <QItem
                                clickable
                                @click="openDialogCreateSegment(row.id)"
                            >
                                <QItemSection avatar>
                                    <QIcon name="mdi-arrow-left-bottom" />
                                </QItemSection>
                                <QItemSection>
                                    <QItemLabel>{{ t('project.instruction.segment.insertUnder') }}</QItemLabel>
                                </QItemSection>
                            </QItem>
                        </QList>
                    </QMenu>
                </AtomicButton>
            </QTd>
        </template>
    </QTable>
    <AtomicButton
        class="btn-segment"
        :label="t('project.instruction.segment.new')"
        @click="openDialogCreateSegment()"
    />
    <ProjectInstructionSegmentDialog
        v-model="dialogCreateSegment"
        :insert-after="insertAfter"
        is-new
    />
</template>

<style scoped lang="sass">
.spinner
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 1

.btn-segment
    width: fit-content

.q-table
    .options
        display: flex
        height: fit-content
        justify-content: end


        .order
            display: flex
            flex-direction: column
            align-items: end

            .opacity
                opacity: 0

            .q-btn
                width: fit-content

:deep(.q-table tbody .resolved)
    background-color: var(--color-neutral-300)

.turns
    display: flex
    gap: 0.5rem
</style>
