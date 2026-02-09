import { computed, type ModelRef, reactive } from 'vue'
import type { Segment, SegmentNoCollection } from '#/project.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'

export const useProjectInstructionSegmentDialog = (
    props: {
        segment?: Segment
        isNew: boolean
        insertAfter?: string
    },
    model: ModelRef<boolean>,
) => {
    const { t } = useI18n()
    const { useHandleError } = useUtils()
    const resourceStore = useResourceStore()

    const workSegment = reactive<SegmentNoCollection>({
        content: '',
        improvableElements: '',
        exception: '',
        improvedSegment: '',
    })

    const segmentsToDisplayInTheImprovedSegmentSelect = computed(() => {
        const hasExceptionsOrImprovableElements = (segmentToCompare: Segment, segmentUpdated?: Segment) =>
            (!!segmentToCompare.exception || !!segmentToCompare.improvableElements) &&
            segmentToCompare.collection !== segmentUpdated?.id

        const isSegmentCollectionSameAsTheInstructedCollection = (segmentToCompare: Segment) => {
            const instructedCollectionId =
                resourceStore.resource?.instructionTurns?.[resourceStore.statusName].turns[0]?.collection
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

    const segmentLabel = (segment?: Segment) => {
        const name = `${t('views.project.instruction.tableFields.line')}: ${segment?.order} | ${t('fn.segment.i')}: ${segment?.content || t('common.none')} | ${t('views.project.instruction.tableFields.exception')}: ${segment?.exception || t('common.none')} | ${t('views.project.instruction.tableFields.improvableElements')}: ${segment?.improvableElements || t('common.none')}`
        return segment ? name : ''
    }

    const onHide = () => {
        workSegment.content = ''
        workSegment.improvableElements = ''
        workSegment.exception = ''
        workSegment.improvedSegment = ''
    }

    const createSegment = async (segment: SegmentNoCollection, afterSegment?: string) => {
        try {
            const response = await axiosI.post<Segment>('/segments/', {
                content: segment.content,
                ...(segment.improvableElements && { improvable_elements: segment.improvableElements }),
                ...(segment.exception && { exception: segment.exception }),
                ...(segment.improvedSegment && { improved_segment: segment.improvedSegment }),
                collection:
                    resourceStore.resource && resourceStore.resource.instructionTurns
                        ? resourceStore.resource.instructionTurns[resourceStore.statusName].turns[0]?.collection
                        : undefined,
                ...(afterSegment && { after_segment: afterSegment }),
            })
            if (afterSegment) {
                await resourceStore.getSegments()
            } else {
                resourceStore.segments.push(response.data)
            }
        } catch (e) {
            useHandleError(e)
        }
    }

    const updateSegment = async (segmentId: string, updatedFields: Partial<SegmentNoCollection>) => {
        try {
            const response = await axiosI.patch<Segment>(`/segments/${segmentId}/`, updatedFields)
            const index = resourceStore.segments.findIndex((seg) => seg.id === segmentId)
            if (index !== -1) {
                resourceStore.segments[index] = response.data
            }
        } catch (e) {
            useHandleError(e)
        }
    }

    const onSave = async () => {
        if (props.isNew) {
            await createSegment(workSegment, props.insertAfter)
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
            await updateSegment(props.segment?.id || '', updatedFields)
            model.value = false
        }
    }

    return {
        workSegment,
        segmentLabel,
        onHide,
        onSave,
        segmentsToDisplayInTheImprovedSegmentSelect,
    }
}
