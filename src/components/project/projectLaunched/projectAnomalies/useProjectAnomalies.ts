import { computed, type Ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { CollectionsInResource, Resource } from '#/project.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'

export const useProjectAnomalies = (dialogModal: Ref<boolean, boolean> | undefined) => {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const resourceStore = useResourceStore()
    const resetInstruction = async () => {
        try {
            const response = await axiosI.patch<Pick<Resource, 'id' | 'status' | 'instructionTurns'>>(
                `/resources/${resourceStore.id}/reset/`,
            )

            const oldStatus = resourceStore.status
            resourceStore.status = response.data.status
            resourceStore.instructionTurns = response.data.instructionTurns
            if (dialogModal) dialogModal.value = false
            await resourceStore.fetchResources(oldStatus)
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknownRetry'),
            })
        }
    }
    const collectionsSortedByOrderInInstructionTurns = computed<CollectionsInResource[]>(() => {
        if (!resourceStore.instructionTurns || !resourceStore.instructionTurns.turns || !resourceStore.collections) {
            return []
        }
        const turns = resourceStore.instructionTurns.turns
        return turns
            .map((turn) => resourceStore.collections.find((collection) => collection.id === turn.collection))
            .filter((item): item is (typeof resourceStore.collections)[0] => item !== undefined)
    })

    const reassignTurn = async (collection?: CollectionsInResource, controller?: boolean) => {
        try {
            let response
            if (controller) {
                response = await axiosI.patch(`/resources/${resourceStore.id}/reassign-turn/`, {
                    controller: true,
                })
            } else {
                if (!collection) throw new Error()

                response = await axiosI.patch<Pick<Resource, 'id' | 'status' | 'instructionTurns'>>(
                    `/resources/${resourceStore.id}/reassign-turn/`,
                    {
                        collection_id: collection.id,
                        library_id: collection.library,
                    },
                )
            }

            const oldStatus = resourceStore.status
            resourceStore.status = response.data.status
            resourceStore.instructionTurns = response.data.instructionTurns
            if (dialogModal) dialogModal.value = false
            await resourceStore.fetchResources(oldStatus)
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    return {
        reassignTurn,
        collectionsSortedByOrderInInstructionTurns,
        resetInstruction,
    }
}
