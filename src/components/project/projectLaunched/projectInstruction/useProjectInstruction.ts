import { computed, type Ref, ref } from 'vue'
import type { CollectionsInResource, InstructionTurn } from '#/project.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { ResourceStatus } from '&/project.ts'

export const useProjectInstruction = (dialogModal: Ref<boolean> | undefined) => {
    const { t } = useI18n()
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()

    const dialogCreateSegment = ref<boolean>(false)
    const insertAfter = ref<string | undefined>()

    const turnsWithNames = computed(() => {
        if (resourceStore.status === ResourceStatus.Positioning) return null

        const retrieveCollectionName = (el: InstructionTurn): string => {
            const collection = resourceStore.collections.find((collection) => collection.id === el.collection)
            return `${t('project.resources.callNumber')}: ${collection?.callNumber} - ${t('project.resources.holdStatement')}: ${collection?.holdStatement} - ${t('project.resources.position')}: ${collection?.position}`
        }

        return resourceStore.instructionTurns?.turns.map((el: InstructionTurn) => ({
            library: projectStore.libraries.find((library) => library.id === el.library)?.name,
            collection: retrieveCollectionName(el),
            collectiondId: el.collection,
        }))
    })

    const onConfirmAnomaliesDeclaration = async () => {
        await resourceStore.finishTurn()
        if (dialogModal) dialogModal.value = false
    }

    const displayConfirmNextTurnWithoutAnySegment = computed<boolean>(() => {
        const statusString = resourceStore.statusName === 'boundCopies' ? 'bound' : 'unbound'
        return !resourceStore.segments.find((el) => {
            const collectionIdInFirstPositionInInstructionTurns =
                resourceStore.instructionTurns?.[`${resourceStore.statusName}`].turns[0].collection
            return el.collection === collectionIdInFirstPositionInInstructionTurns && el.segmentType === statusString
        })
    })
    const collectionToBeInstructed = computed<CollectionsInResource | undefined>(() => {
        return resourceStore.collections.find(
            (el) => el.id === resourceStore.instructionTurns?.[`${resourceStore.statusName}`].turns[0].collection,
        )
    })

    return {
        dialogCreateSegment,
        insertAfter,
        turnsWithNames,
        onConfirmAnomaliesDeclaration,
        displayConfirmNextTurnWithoutAnySegment,
        collectionToBeInstructed,
    }
}
