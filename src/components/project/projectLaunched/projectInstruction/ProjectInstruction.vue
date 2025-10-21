<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useProjectInstruction } from '@/components/project/projectLaunched/projectInstruction/useProjectInstruction.ts'
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import AnomalyDeclarationBtn from '@/components/anomaly/AnomalyDeclarationBtn.vue'
import { computed, inject, type Ref } from 'vue'
import { useAnomalyStore } from '@/stores/anomalyStore.ts'
import type { CollectionsInResource } from '#/project.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const anomalyStore = useAnomalyStore()
const dialogModal = inject<Ref<boolean>>('dialogModal')

const { dialogCreateSegment, insertAfter, turnsWithNames, onConfirmAnomaliesDeclaration } =
    useProjectInstruction(dialogModal)

const collectionToBeInstructed = computed<CollectionsInResource | undefined>(() => {
    return resourceStore.collections.find(
        (el) => el.id === resourceStore.instructionTurns?.[`${resourceStore.statusName}`].turns[0].collection,
    )
})
</script>

<template>
    <div class="instruction">
        <div>
            <div class="turns">
                <p>{{ t('project.instruction.turns') }}:</p>
                <p
                    v-for="(turn, index) in turnsWithNames"
                    :key="index"
                >
                    <span
                        :class="{
                            bold:
                                turn.collectiondId ===
                                resourceStore.instructionTurns?.[`${resourceStore.statusName}`].turns[0].collection,
                        }"
                    >
                        {{ turn.library }}
                    </span>
                    <span>{{ index + 1 === turnsWithNames?.length ? '' : ',' }}</span>
                    <QTooltip v-if="turn.collectiondId !== collectionToBeInstructed?.id">
                        {{ turn.collection }}
                    </QTooltip>
                    <QTooltip v-else> {{ t('project.resources.collectionToBeInstructed') }} </QTooltip>
                </p>
            </div>
            <div
                v-if="collectionToBeInstructed"
                class="collection-infos"
            >
                <p>{{ t('project.resources.infoAboutCollection') }}:</p>
                <QChip>
                    {{ t('project.resources.callNumber') }}:
                    <span>{{ collectionToBeInstructed.callNumber || '-' }}</span>
                </QChip>
                <QChip>
                    {{ t('project.resources.holdStatement') }}:
                    <span>{{ collectionToBeInstructed.holdStatement || '-' }}</span>
                </QChip>
            </div>
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
                :disable="!!resourceStore.anomaliesUnfixed.length || !!anomalyStore.anomalyAddForSegment.length"
                icon="mdi-content-save-move"
                :label="t('project.instruction.next')"
                no-border
                require-confirmation
                @confirm="onConfirmAnomaliesDeclaration"
            >
                <QTooltip
                    v-if="!!resourceStore.anomaliesUnfixed.length"
                    :delay="1000"
                >
                    {{ t('project.anomaly.actionBtnDisabled', 2) }}
                </QTooltip>
                <QTooltip
                    v-if="!!anomalyStore.anomalyAddForSegment.length"
                    :delay="1000"
                >
                    {{ t('project.anomaly.actionBtnDisabledByAnomalySelection', 2) }}
                </QTooltip>
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
.q-chip
    background-color: var(--color-neutral-100)
    span
        margin-left: 0.2rem
        font-weight: bold
</style>
