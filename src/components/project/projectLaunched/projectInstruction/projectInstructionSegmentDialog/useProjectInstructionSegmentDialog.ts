import { computed, type ModelRef, reactive } from 'vue'
import type { Segment, SegmentNoCollection } from '#/project.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'

export const useProjectInstructionSegmentDialog = (
    props: {
        segment?: Segment
        isNew: boolean
        insertAfter?: string
    },
    model: ModelRef<boolean>,
) => {
    const { t } = useI18n()
    const resourceStore = useResourceStore()

    const workSegment = reactive<SegmentNoCollection>({
        content: '',
        improvableElements: '',
        exception: '',
        improvedSegment: '',
    })

    const segmentLabel = (segment?: Segment) => {
        const name = `${t('project.instruction.tableFields.line')}: ${segment?.order} | ${t('project.instruction.tableFields.segment')}: ${segment?.content || t('common.none')} | ${t('project.instruction.tableFields.exception')}: ${segment?.exception || t('common.none')} | ${t('project.instruction.tableFields.improvableElements')}: ${segment?.improvableElements || t('common.none')}`
        return segment ? name : ''
    }

    const onHide = () => {
        workSegment.content = ''
        workSegment.improvableElements = ''
        workSegment.exception = ''
        workSegment.improvedSegment = ''
    }

    const onSave = async () => {
        if (props.isNew) {
            await resourceStore.createSegment(workSegment, props.insertAfter)
            model.value = false
        } else {
            const updatedFields: Partial<SegmentNoCollection> = {}
            if (props.segment) {
                for (const key of Object.keys(workSegment) as (keyof SegmentNoCollection)[]) {
                    if (workSegment[key] !== props.segment[key]) {
                        updatedFields[key] = workSegment[key]
                    }
                }
            }
            await resourceStore.updateSegment(props.segment?.id || '', updatedFields)
            model.value = false
        }
    }

    const segmentsToDisplayInTheImprovedSegmentSelect = computed(() => {
        const hasExceptionsOrImprovableElements = (segmentToCompare: Segment, segmentUpdated?: Segment) =>
            (!!segmentToCompare.exception || !!segmentToCompare.improvableElements) &&
            segmentToCompare.collection !== segmentUpdated?.id

        const isSegmentCollectionSameAsTheInstructedCollection = (segmentToCompare: Segment) => {
            const instructedCollectionId =
                resourceStore.resource?.instructionTurns?.[resourceStore.statusName].turns[0].collection
            return segmentToCompare.collection === instructedCollectionId
        }

        return resourceStore.segments.filter((el) => {
            if (props.isNew && !props.segment) {
                return hasExceptionsOrImprovableElements(el) && !isSegmentCollectionSameAsTheInstructedCollection(el)
            } else {
                return (
                    el.id !== props.segment?.id &&
                    hasExceptionsOrImprovableElements(el, props.segment) &&
                    !isSegmentCollectionSameAsTheInstructedCollection(el)
                )
            }
        })
    })

    return {
        workSegment,
        segmentLabel,
        onHide,
        onSave,
        segmentsToDisplayInTheImprovedSegmentSelect,
    }
}
