<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import { inject, onMounted, type Ref } from 'vue'
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

const dialogModal = inject<Ref<boolean>>('dialogModal')

const onConfirm = async () => {
    await resourceStore.finishTurn()
    if (dialogModal) dialogModal.value = false
}

const isSegmentCollectionLibrarySameAsLibrarySelected = (row: Segment) => {
    return resourceStore.libraryIdSelected === resourceStore.collections.find((el) => el.id === row.collection)?.library
}

onMounted(async () => {
    tableLoading.value = true
    await resourceStore.fetchSegments()
    tableLoading.value = false
})
</script>

<template>
    <div class="instruction">
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
            class="table"
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
            <template #body-cell-options="{ row }: { row: Segment }">
                <QTd
                    v-if="resourceStore.isInstructorForLibrarySelected"
                    class="options"
                >
                    <div
                        v-if="
                            row.acl &&
                            row.acl.up &&
                            row.acl.down &&
                            isSegmentCollectionLibrarySameAsLibrarySelected(row)
                        "
                        class="order"
                    >
                        <AtomicButton
                            :class="{ opacity: row.order === 1 }"
                            icon="mdi-chevron-up"
                            no-border
                            size="sm"
                            @click="orderSegment(row, 'up')"
                        />
                        <AtomicButton
                            :class="{
                                opacity:
                                    row.order === resourceStore.segments.length || resourceStore.segments.length === 1,
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
                                    v-if="
                                        row.acl &&
                                        row.acl.partialUpdate &&
                                        isSegmentCollectionLibrarySameAsLibrarySelected(row)
                                    "
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
                                    v-if="
                                        row.acl &&
                                        row.acl.destroy &&
                                        isSegmentCollectionLibrarySameAsLibrarySelected(row)
                                    "
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
                <QTd
                    v-else
                    class="forbidden"
                >
                    <AtomicButton
                        disable
                        icon="mdi-cancel"
                        no-border
                        size="sm"
                    />
                </QTd>
            </template>
            <template #body-cell-resolve="{ value }: { value: string }">
                <QTd
                    class="resolve"
                    @mouseenter="hoveredValue = value"
                    @mouseleave="hoveredValue = null"
                >
                    {{ value }}
                </QTd>
            </template>
            <template
                v-if="resourceStore.shouldInstruct && resourceStore.isInstructorForLibrarySelected"
                #bottom
            >
                <QTr class="bottom">
                    <AtomicButton
                        class="btn-segment"
                        icon="mdi-plus"
                        :label="t('project.instruction.segment.new')"
                        no-border
                        @click="openDialogCreateSegment()"
                    />
                </QTr>
            </template>
            <template
                v-if="resourceStore.shouldInstruct && resourceStore.isInstructorForLibrarySelected"
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
        <AtomicButton
            v-if="resourceStore.shouldInstruct && resourceStore.isInstructorForLibrarySelected"
            class="finish-turn"
            color="primary"
            confirm-button-color="primary"
            icon="mdi-content-save-move"
            :label="t('project.instruction.next')"
            no-border
            require-confirmation
            @confirm="onConfirm"
        />
    </div>

    <ProjectInstructionSegmentDialog
        v-model="dialogCreateSegment"
        :insert-after="insertAfter"
        is-new
    />
</template>

<style lang="sass" scoped>
.instruction
    display: flex
    flex-direction: column
    width: 100%
    gap: 1rem

.spinner
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 1

.btn-segment
    width: fit-content

.table
    .options
        display: flex
        justify-content: end
        align-items: center
        .order
            display: flex
            .opacity
                opacity: 0

            .q-btn
                width: fit-content

    .resolve
        text-align: center

    .forbidden
        text-align: right

:deep(.q-table tbody .resolved)
    background-color: var(--color-neutral-300)

.turns
    display: flex
    gap: 0.5rem

.no-data
        display: flex
        justify-content: space-between
        align-items: center
        width: 100%

.bottom
    margin-left: auto

.finish-turn
    margin-top: auto
    align-self: end
</style>
