import { computed, ref, type UnwrapRef } from 'vue'
import { Arbitration, CollectionPosition, PositioningFilter, ResourceStatus } from '&/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { useUtils } from '@/composables/useUtils.ts'
import type { CollectionsInResource, CommentPositioning } from '#/project.ts'

interface CollectionPositionAndExcludeResponse {
    arbitration: Arbitration
    status: ResourceStatus
    shouldInstruct: boolean
    shouldPosition: boolean
}

interface UpdateCollectionPositionResponse extends CollectionPositionAndExcludeResponse {
    position: CollectionPosition
}

interface ExcludeCollectionResponse extends CollectionPositionAndExcludeResponse {
    exclusionReason: string
}

export const useProjectPositioningCollectionCard = (collectionId: string) => {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { useHandleError } = useUtils()
    const resourceStore = useResourceStore()
    const resourcesStore = useResourcesStore()

    const findCollectionInCollections = (collectionId: string): UnwrapRef<CollectionsInResource> | undefined => {
        const collection = resourceStore.collections.find((col) => col.id === collectionId)

        if (!collection) {
            notify({
                message: t('errors.dataUnreachable'),
                color: 'negative',
            })
            return
        }

        return collection
    }

    const collection = findCollectionInCollections(collectionId)
    const newPosition = ref<CollectionPosition>(collection?.position || CollectionPosition.Undefined)

    const exclude = ref<boolean>(false)
    const exclusionReason = ref<string>('')

    const comment = ref<string>('')

    const showSaveBtn = computed(() => {
        return (
            (collection?.position !== newPosition.value && !exclude.value) ||
            (exclude.value && exclusionReason.value !== collection?.exclusionReason) ||
            comment.value !== (collection?.commentPositioning?.content || '')
        )
    })
    const saveBtnLoading = ref<boolean>(false)

    const commentPositioning = async () => {
        if (!collection) {
            notify({
                message: t('errors.dataUnreachable'),
                color: 'negative',
            })
            return
        }

        try {
            const method = collection.commentPositioning?.id ? 'patch' : 'post'
            const response = await axiosI[method]<CommentPositioning>(
                `collections/${collectionId}/comment-positioning/`,
                { content: comment.value },
            )

            collection.commentPositioning = response.data
        } catch (e) {
            useHandleError(e)
        }
    }

    const _applyResourceUpdateWhenUpdatingPositionOrExcludingCollection = async (
        response: CollectionPositionAndExcludeResponse,
    ) => {
        if (!resourceStore.resource) {
            notify({
                message: t('errors.dataUnreachable'),
                color: 'negative',
            })
            return
        }

        resourceStore.resource.arbitration = response.arbitration
        resourceStore.resource.status = response.status
        resourceStore.resource.shouldPosition = response.shouldPosition
        resourceStore.resource.shouldInstruct = response.shouldInstruct

        const resourceInResources = resourcesStore.resources.find((el) => el.id === resourceStore.resource?.id)
        if (resourceInResources) {
            resourceInResources.arbitration = response.arbitration
            resourceInResources.status = response.status
            resourceInResources.shouldPosition = response.shouldPosition
            resourceInResources.shouldInstruct = response.shouldInstruct

            if (resourcesStore.positioningFilter !== PositioningFilter.All)
                await resourcesStore.getResources({ status: [ResourceStatus.Positioning] })
        }
    }

    const updatePosition = async (collectionId: string, newPosition: CollectionPosition) => {
        try {
            const response = await axiosI.patch<UpdateCollectionPositionResponse>(
                `collections/${collectionId}/position/`,
                {
                    position: newPosition,
                },
            )

            if (!collection) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }
            collection.position = response.data.position
            collection.exclusionReason = ''

            await _applyResourceUpdateWhenUpdatingPositionOrExcludingCollection({
                arbitration: response.data.arbitration,
                status: response.data.status,
                shouldPosition: response.data.shouldPosition,
                shouldInstruct: response.data.shouldInstruct,
            })
        } catch (e) {
            useHandleError(e)
        }
    }

    const excludeCollection = async (collectionId: string, exclusionReason: string) => {
        try {
            const response = await axiosI.patch<ExcludeCollectionResponse>(`collections/${collectionId}/exclude/`, {
                exclusion_reason: exclusionReason,
            })
            if (!collection) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }
            collection.position = CollectionPosition.Excluded
            collection.exclusionReason = response.data.exclusionReason

            await _applyResourceUpdateWhenUpdatingPositionOrExcludingCollection({
                arbitration: response.data.arbitration,
                status: response.data.status,
                shouldPosition: response.data.shouldPosition,
                shouldInstruct: response.data.shouldInstruct,
            })
        } catch (e) {
            useHandleError(e)
        }
    }

    const onSave = async () => {
        if (!collection) {
            const { notify } = useComposableQuasar()
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
            return
        }
        saveBtnLoading.value = true

        if (exclude.value && exclusionReason.value !== collection.exclusionReason)
            await excludeCollection(collection.id, exclusionReason.value)
        else if (newPosition.value && newPosition.value !== collection.position)
            await updatePosition(collection.id, newPosition.value)

        if (comment.value !== (collection.commentPositioning?.content || '')) {
            await commentPositioning()
        }

        saveBtnLoading.value = false
    }

    return {
        collection,
        newPosition,
        exclude,
        exclusionReason,
        comment,
        showSaveBtn,
        saveBtnLoading,
        onSave,
    }
}
