import { computed, type Ref, ref } from 'vue'
import type { CollectionsInResource, InstructionTurn, Segment } from '#/project.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { ResourceStatus } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { useUtils } from '@/composables/useUtils.ts'

export const useProjectInstruction = (dialogModal: Ref<boolean> | undefined) => {
    const { t } = useI18n()
    const { useHandleError } = useUtils()
    const resourcesStore = useResourcesStore()
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()

    // REFS
    const dialogCreateSegment = ref<boolean>(false)
    const insertAfter = ref<string | undefined>()

    // COMPUTED
    const turnsWithNames = computed(() => {
        if (!projectStore.project || !resourceStore.resource) return null
        if (resourceStore.resource.status === ResourceStatus.Positioning) return null

        const retrieveCollectionName = (el: InstructionTurn): string => {
            const collection = resourceStore.collections.find((collection) => collection.id === el.collection)
            return `${t('project.resources.callNumber')}: ${collection?.callNumber} - ${t('project.resources.holdStatement')}: ${collection?.holdStatement} - ${t('project.resources.position')}: ${collection?.position}`
        }

        return (
            resourceStore.resource.instructionTurns?.turns.map((el: InstructionTurn) => ({
                library: projectStore.project
                    ? projectStore.project.libraries.find((library) => library.id === el.library)?.name
                    : '',
                collection: retrieveCollectionName(el),
                collectiondId: el.collection,
            })) || []
        )
    })

    const displayConfirmNextTurnWithoutAnySegment = computed<boolean>(() => {
        const statusString = resourceStore.statusName === 'boundCopies' ? 'bound' : 'unbound'
        return !resourceStore.segments.find((el) => {
            const collectionIdInFirstPositionInInstructionTurns =
                resourceStore.resource?.instructionTurns?.[`${resourceStore.statusName}`].turns[0].collection
            return el.collection === collectionIdInFirstPositionInInstructionTurns && el.segmentType === statusString
        })
    })
    const collectionToBeInstructed = computed<CollectionsInResource | undefined>(() => {
        return resourceStore.collections.find(
            (el) =>
                el.id === resourceStore.resource?.instructionTurns?.[`${resourceStore.statusName}`].turns[0].collection,
        )
    })

    // FUNCTIONS
    const finishTurn = async () => {
        try {
            if (!resourceStore.resource?.shouldInstruct || !resourceStore.resource?.instructionTurns)
                throw new Error('Instruction is not allowed')
            const collectionId =
                resourceStore.resource && resourceStore.resource.instructionTurns
                    ? resourceStore.resource.instructionTurns[resourceStore.statusName].turns[0].collection
                    : undefined

            await axiosI.post<Segment>(`/collections/${collectionId}/finish_turn/`)
            await resourcesStore.getResources({ status: [resourceStore.resource?.status] })
        } catch (e) {
            useHandleError(e)
        }
    }

    const onConfirmAnomaliesDeclaration = async () => {
        await finishTurn()
        if (dialogModal) dialogModal.value = false
    }

    return {
        dialogCreateSegment,
        insertAfter,
        turnsWithNames,
        onConfirmAnomaliesDeclaration,
        displayConfirmNextTurnWithoutAnySegment,
        collectionToBeInstructed,
    }
}
