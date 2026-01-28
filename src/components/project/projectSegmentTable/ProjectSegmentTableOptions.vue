<script setup lang="ts">
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import AtomicConfirmationDialog from '@/components/atomic/AtomicConfirmationDialog.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useProjectSegmentTableOptions } from '@/components/project/projectSegmentTable/projectSegmentTableOptions/useProjectSegmentTableOptions.ts'
import { useI18n } from 'vue-i18n'
import type { Segment } from '#/project.ts'

defineProps<{
    row: Segment
    openDialogCreateSegment: (insertAfterId: string | undefined) => void
}>()
const emit = defineEmits<{
    (e: 'addAnomaly'): void
}>()

const { t } = useI18n()

const {
    orderSegment,
    displayUpdateButton,
    displayReorderButtons,
    opacifyReorderButtonUp,
    opacifyReorderButtonDown,
    displayDeleteButton,
    displayInsertUnderButton,
    displayAddAnomalyButton,
    dialogUpdateSegment,
    dialogDeleteSegment,
    areActionDisabled,
    deleteSegment,
} = useProjectSegmentTableOptions()
</script>

<template>
    <div class="options">
        <div
            v-if="displayReorderButtons(row)"
            class="order"
        >
            <AtomicButton
                :class="{ opacity: opacifyReorderButtonUp(row) }"
                :disable="areActionDisabled"
                icon="mdi-chevron-up"
                no-border
                size="sm"
                @click="orderSegment(row, 'up')"
            >
                <QTooltip
                    v-if="areActionDisabled"
                    :delay="1000"
                    >{{ t('views.project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                >
            </AtomicButton>
            <AtomicButton
                :class="{ opacity: opacifyReorderButtonDown(row) }"
                :disable="areActionDisabled"
                icon="mdi-chevron-down"
                no-border
                size="sm"
                @click="orderSegment(row, 'down')"
            >
                <QTooltip
                    v-if="areActionDisabled"
                    :delay="1000"
                    >{{ t('views.project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                >
            </AtomicButton>
        </div>
        <AtomicButton
            icon="mdi-dots-vertical"
            no-border
            size="sm"
        >
            <QMenu auto-close>
                <QList>
                    <QItem
                        v-if="displayUpdateButton(row)"
                        clickable
                        :disable="areActionDisabled"
                        @click="dialogUpdateSegment = true"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-pencil" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('common.update') }}</QItemLabel>
                        </QItemSection>
                        <QTooltip
                            v-if="areActionDisabled"
                            :delay="1000"
                            >{{ t('views.project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                        >
                    </QItem>
                    <QItem
                        v-if="displayDeleteButton(row)"
                        clickable
                        :disable="areActionDisabled"
                        @click="dialogDeleteSegment = true"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-delete-forever" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('common.delete') }}</QItemLabel>
                        </QItemSection>
                        <AtomicConfirmationDialog
                            v-model="dialogDeleteSegment"
                            @confirm="deleteSegment(row.id)"
                        />
                        <QTooltip
                            v-if="areActionDisabled"
                            :delay="1000"
                            >{{ t('views.project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                        >
                    </QItem>
                    <QItem
                        v-if="displayInsertUnderButton(row)"
                        clickable
                        :disable="areActionDisabled"
                        @click="openDialogCreateSegment(row.id)"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-arrow-left-bottom" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('views.project.instruction.segment.insertUnder') }}</QItemLabel>
                        </QItemSection>
                        <QTooltip
                            v-if="areActionDisabled"
                            :delay="1000"
                            >{{ t('views.project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                        >
                    </QItem>
                    <QItem
                        v-if="displayAddAnomalyButton(row)"
                        clickable
                        @click="emit('addAnomaly')"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-alert-circle" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('views.project.instruction.segment.signalAnomaly') }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                </QList>
            </QMenu>
            <ProjectInstructionSegmentDialog
                v-model="dialogUpdateSegment"
                :segment="row"
            />
            <AtomicConfirmationDialog
                v-model="dialogDeleteSegment"
                @confirm="deleteSegment(row.id)"
            />
        </AtomicButton>
    </div>
</template>

<style scoped lang="sass">
.options
        display: flex
        justify-content: end
        align-items: center
        .order
            display: flex
            .opacity
                opacity: 0
                cursor: default

            .q-btn
                width: fit-content
</style>
