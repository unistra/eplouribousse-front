<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import type { Segment, SegmentI } from '#/project.ts'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { onMounted, reactive } from 'vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import { useResourceStore } from '@/stores/resourceStore.ts'

const model = defineModel<boolean>()
const { t } = useI18n()
const resourceStore = useResourceStore()

const props = defineProps<{
    segment: Segment
}>()

const workSegment = reactive<SegmentI>({
    content: '',
    improvableElements: '',
    exception: '',
    improvedSegment: '',
    collection: '',
})

onMounted(async () => {
    if (props.segment) {
        workSegment.content = props.segment.content
        workSegment.improvableElements = props.segment.improvableElements
        workSegment.exception = props.segment.exception
        workSegment.improvedSegment = props.segment.improvedSegment
        workSegment.collection = props.segment.collection
    }
})
</script>

<template>
    <QDialog v-model="model">
        <QCard>
            <QCardSection>Edit or create</QCardSection>
            <QCardSection>
                <QForm>
                    <AtomicInput
                        v-model="workSegment.content"
                        :label="t('project.instruction.tableFields.segment')"
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
                        v-model="workSegment.improvedSegment"
                        emit-value
                        :label="t('project.instruction.tableFields.resolve')"
                        map-options
                        :option-label="
                            (el: Segment) =>
                                `${t('project.instruction.tableFields.order')}: ${el.order} | ${t('project.instruction.tableFields.segment')}: ${el.content || t('common.none')} | ${t('project.instruction.tableFields.exception')}: ${el.exception || t('common.none')} | ${t('project.instruction.tableFields.improvableElements')}: ${el.improvableElements || t('common.none')}`
                        "
                        option-value="id"
                        :options="resourceStore.segments.filter((el) => el.id !== segment.id)"
                    />
                    <AtomicSelect
                        v-model="workSegment.collection"
                        emit-value
                        :label="t('project.collection.i')"
                        map-options
                        option-label="id"
                        option-value="id"
                        :options="
                            resourceStore.collections.filter((el) => el.library === resourceStore.libraryIdSelected)
                        "
                    />
                </QForm>
            </QCardSection>
            <QCardActions align="right">
                <AtomicButton
                    :label="t('common.cancel')"
                    @click="model = false"
                />
                <AtomicButton :label="t('common.save')" />
            </QCardActions>
        </QCard>
    </QDialog>
</template>

<style lang="sass" scoped>
.q-form
    display: flex
    flex-direction: column
    gap: 1rem
</style>
