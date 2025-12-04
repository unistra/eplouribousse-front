import { type Ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { CollectionsInResource, Resource } from '#/project.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { ResourceStatus } from '&/project.ts'
import { useUtils } from '@/composables/useUtils.ts'

export const useProjectAnomalies = (dialogModal: Ref<boolean, boolean> | undefined) => {
    const { useHandleError } = useUtils()
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const resourceStore = useResourceStore()
    const resourcesStore = useResourcesStore()
    const resetInstruction = async () => {
        if (!resourceStore.resource) {
            notify({
                message: t('errors.dataUnreachable'),
                color: 'negative',
            })
            return
        }

        try {
            const response = await axiosI.patch<Pick<Resource, 'id' | 'status' | 'instructionTurns'>>(
                `/resources/${resourceStore.resource.id}/reset/`,
            )

            const oldStatus = resourceStore.resource?.status || ResourceStatus.Positioning
            resourceStore.resource.status = response.data.status
            resourceStore.resource.instructionTurns = response.data.instructionTurns
            if (dialogModal) dialogModal.value = false
            await resourcesStore.getResources({ status: [oldStatus] })
        } catch (e) {
            useHandleError(e)
        }
    }

    const reassignTurn = async (collection?: CollectionsInResource, controller?: boolean) => {
        if (!resourceStore.resource) {
            notify({
                message: t('errors.dataUnreachable'),
                color: 'negative',
            })
            return
        }

        try {
            let response
            if (controller) {
                response = await axiosI.patch(`/resources/${resourceStore.resource.id}/reassign-turn/`, {
                    controller: true,
                })
            } else {
                if (!collection) throw new Error()

                response = await axiosI.patch<Pick<Resource, 'id' | 'status' | 'instructionTurns'>>(
                    `/resources/${resourceStore.resource.id}/reassign-turn/`,
                    {
                        collection_id: collection.id,
                        library_id: collection.library,
                    },
                )
            }

            const oldStatus = resourceStore.resource.status
            resourceStore.resource.status = response.data.status
            resourceStore.resource.instructionTurns = response.data.instructionTurns
            if (dialogModal) dialogModal.value = false
            await resourcesStore.getResources({ status: [oldStatus] })
        } catch (e) {
            useHandleError(e)
        }
    }

    return {
        reassignTurn,
        resetInstruction,
    }
}
