<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useProjectInstruction } from '@/components/project/projectLaunched/projectInstruction/useProjectInstruction.ts'
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import AnomalyDeclarationBtn from '@/components/anomaly/AnomalyDeclarationBtn.vue'
import { inject, type Ref } from 'vue'

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const dialogModal = inject<Ref<boolean>>('dialogModal')

const { dialogCreateSegment, insertAfter, turnsWithNames, onConfirmAnomaliesDeclaration } =
    useProjectInstruction(dialogModal)
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
        <div
            v-if="resourceStore.shouldInstruct && projectStore.userIsInstructorForLibrarySelected"
            class="buttons"
        >
            <AnomalyDeclarationBtn
                v-if="resourceStore.anomaliesUnfixed.length"
                @confirm="dialogModal = false"
            />
            <AtomicButton
                color="primary"
                confirm-button-color="primary"
                :disable="!!resourceStore.anomaliesUnfixed.length"
                icon="mdi-content-save-move"
                :label="t('project.instruction.next')"
                no-border
                require-confirmation
                @confirm="onConfirmAnomaliesDeclaration"
            >
                <QTooltip
                    v-if="!!resourceStore.anomaliesUnfixed.length"
                    :delay="1000"
                    >{{ t('project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                >
            </AtomicButton>
        </div>
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

.buttons
    margin-top: auto
    align-self: end
    display: flex
    gap: 1rem
</style>
