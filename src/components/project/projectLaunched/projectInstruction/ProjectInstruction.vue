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
import { useAnomalyStore } from '@/stores/anomalyStore.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const anomalyStore = useAnomalyStore()
const dialogModal = inject<Ref<boolean>>('dialogModal')

const {
    dialogCreateSegment,
    insertAfter,
    turnsWithNames,
    onConfirmAnomaliesDeclaration,
    collectionToBeInstructed,
    displayConfirmNextTurnWithoutAnySegment,
} = useProjectInstruction(dialogModal)
</script>

<template>
    <div class="instruction">
        <div>
            <div class="turns">
                <p>{{ t('views.project.instruction.turns') }}:</p>
                <p
                    v-for="(turn, index) in turnsWithNames"
                    :key="index"
                >
                    <span
                        :class="{
                            bold:
                                turn.collectiondId ===
                                resourceStore.resource?.instructionTurns?.[`${resourceStore.statusName}`].turns[0]
                                    ?.collection,
                        }"
                    >
                        {{ turn.library }}
                    </span>
                    <span>{{ index + 1 === turnsWithNames?.length ? '' : ',' }}</span>
                    <QTooltip v-if="turn.collectiondId !== collectionToBeInstructed?.id">
                        {{ turn.collection }}
                    </QTooltip>
                    <QTooltip v-else> {{ t('fn.collection.toBeInstructed.i') }} </QTooltip>
                </p>
            </div>
            <div
                v-if="collectionToBeInstructed"
                class="collection-infos"
            >
                <p>{{ t('fn.collection.toBeInstructed.info') }}:</p>
                <QChip class="chip-label-value">
                    {{ t('fn.collection.fields.callNumber.i') }}:
                    <span>{{ collectionToBeInstructed.callNumber || '-' }}</span>
                </QChip>
                <QChip class="chip-label-value">
                    {{ t('fn.collection.fields.holdStatement.i') }}:
                    <span>{{ collectionToBeInstructed.holdStatement || '-' }}</span>
                </QChip>
            </div>
        </div>
        <ProjectSegmentTable />
        <div
            v-if="resourceStore.resource?.shouldInstruct && projectStore.userIsInstructorForLibrarySelected"
            class="buttons"
        >
            <AnomalyDeclarationBtn
                v-if="resourceStore.anomaliesUnfixed.length"
                @confirm="dialogModal = false"
            />
            <AtomicButton
                color="primary"
                confirm-button-color="primary"
                :disable="!!resourceStore.anomaliesUnfixed.length || !!anomalyStore.anomalyAddForSegment.length"
                icon="mdi-content-save-move"
                :label="t('views.project.instruction.next')"
                no-border
                require-confirmation
                @confirm="onConfirmAnomaliesDeclaration"
            >
                <QTooltip
                    v-if="!!resourceStore.anomaliesUnfixed.length"
                    :delay="1000"
                >
                    {{ t('views.project.anomaly.actionBtnDisabled', 2) }}
                </QTooltip>
                <QTooltip
                    v-if="!!anomalyStore.anomalyAddForSegment.length"
                    :delay="1000"
                >
                    {{ t('views.project.anomaly.actionBtnDisabledByAnomalySelection', 2) }}
                </QTooltip>
                <template
                    v-if="displayConfirmNextTurnWithoutAnySegment"
                    #confirmation-content
                >
                    <QCardSection>{{ t('views.project.instruction.voidSegmentCreationWarning') }}</QCardSection>
                </template>
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

.turns
    display: flex
    gap: 0.5rem

.buttons
    align-self: end
    display: flex
    gap: 1rem

.bold
    font-weight: bold

.collection-infos
    display: flex
    align-items: center
</style>
