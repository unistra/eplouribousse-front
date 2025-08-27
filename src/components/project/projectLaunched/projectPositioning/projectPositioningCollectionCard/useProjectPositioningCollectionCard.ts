import { computed, ref } from 'vue'
import { CollectionPosition } from '&/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'

export const useProjectPositioningCollectionCard = (collectionId: string) => {
    const resourceStore = useResourceStore()
    const { t } = useI18n()

    const collection = resourceStore.collections.find((col) => col.id === collectionId)
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
            await resourceStore.excludeCollection(collection.id, exclusionReason.value)
        else if (newPosition.value && newPosition.value !== collection.position)
            await resourceStore.updatePosition(collection.id, newPosition.value)

        if (comment.value !== (collection.commentPositioning?.content || '')) {
            await resourceStore.commentPositioning(collection.id, comment.value)
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
