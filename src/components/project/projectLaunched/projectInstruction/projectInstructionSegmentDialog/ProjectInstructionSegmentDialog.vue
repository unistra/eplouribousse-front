<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import type { Segment } from '#/project.ts'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { onMounted } from 'vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectInstructionSegmentDialog } from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/useProjectInstructionSegmentDialog.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const model = defineModel<boolean>({ required: true })
const props = defineProps<{
    segment?: Segment
    isNew: boolean
    insertAfter?: string
}>()

const { workSegment, segmentLabel, onHide, onSave } = useProjectInstructionSegmentDialog(props, model)

onMounted(() => {
    if (props.segment) {
        workSegment.content = props.segment.content
        workSegment.improvableElements = props.segment.improvableElements
        workSegment.exception = props.segment.exception
        workSegment.improvedSegment = props.segment.improvedSegment
    }
})
</script>

<template>
    <QDialog
        v-model="model"
        @before-hide="onHide"
    >
        <QCard>
            <QCardSection>{{
                isNew ? t('project.instruction.segment.new') : t('project.instruction.segment.update')
            }}</QCardSection>
            <QCardSection>
                <QForm @submit.prevent="onSave">
                    <AtomicInput
                        v-model="workSegment.content"
                        :label="t('project.instruction.tableFields.segment')"
                        :rules="[(val: string) => !!val || t('forms.validation.fieldIsRequired')]"
                        type="text"
                    />
                    <AtomicInput
                        v-model="workSegment.improvableElements"
                        :label="t('project.instruction.tableFields.improvableElements')"
                        type="text"
                    />
                    <AtomicInput
                        v-model="workSegment.exception"
                        :label="t('project.instruction.tableFields.exception')"
                        type="text"
                    />
                    <AtomicSelect
                        v-if="(resourceStore.segments.length === 1 && isNew) || resourceStore.segments.length > 1"
                        v-model="workSegment.improvedSegment"
                        clearable
                        emit-value
                        :label="t('project.instruction.tableFields.resolve')"
                        map-options
                        :option-label="(optionSegment: Segment) => segmentLabel(optionSegment)"
                        option-value="id"
                        :options="
                            resourceStore.segments.filter((el) => (isNew && !segment ? true : el.id !== segment?.id))
                        "
                    />
                    <QCardActions align="right">
                        <AtomicButton
                            :label="t('common.cancel')"
                            @click="model = false"
                        />
                        <AtomicButton
                            :label="t('common.save')"
                            type="submit"
                        />
                    </QCardActions>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="sass" scoped>
.q-form
    display: flex
    flex-direction: column
    gap: 1rem
</style>
