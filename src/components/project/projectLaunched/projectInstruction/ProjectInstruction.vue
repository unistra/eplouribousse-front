<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import { inject, onMounted, type Ref } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useProjectInstruction } from '@/components/project/projectLaunched/projectInstruction/useProjectInstruction.ts'
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'

const { t } = useI18n()
const resourceStore = useResourceStore()
const { tableLoading, dialogCreateSegment, insertAfter, turnsWithNames } = useProjectInstruction()

const dialogModal = inject<Ref<boolean>>('dialogModal')

const onConfirm = async () => {
    await resourceStore.finishTurn()
    if (dialogModal) dialogModal.value = false
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
        <ProjectSegmentTable />
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
