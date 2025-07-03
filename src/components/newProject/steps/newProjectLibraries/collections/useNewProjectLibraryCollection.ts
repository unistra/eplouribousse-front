import { ref } from 'vue'
import type { Collection, ImportCSVError, ImportCSVResponse } from '#/project'
import type { Pagination } from '#/pagination.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useNewProjectLibraryCollection = (libraryId: string) => {
    const store = useProjectStore()
    const { t } = useI18n()
    const { notify } = useComposableQuasar()

    const fileInput = ref<HTMLInputElement | null>(null)

    const modalDeleteCollection = ref(false)

    const modalImportCSVResponse = ref(false)
    const importCSVResponse = ref<ImportCSVResponse | undefined>(undefined)
    const modalImportCSVError = ref(false)
    const importCSVError = ref<ImportCSVError | undefined>(undefined)

    const collection = ref<Pagination<Collection> | null | undefined>(undefined)

    const isCollectionLoading = ref(false)
    const getCollection = async () => {
        isCollectionLoading.value = true
        collection.value = await store.getCollection(libraryId)
        isCollectionLoading.value = false
    }

    const handleFileUpload = async (file: File | null) => {
        if (!file || !(file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            notify({
                type: 'negative',
                message: t('newProject.steps.libraries.collection.errors.wrongExtension'),
            })
            return
        }

        try {
            const response = await store.importCollection(file, libraryId)

            if (Array.isArray(response)) {
                // It's of type ImportCSVError
                console.log('INTO ImportCSVError', response)
                importCSVError.value = response
                modalImportCSVError.value = true
                if (fileInput.value) fileInput.value.value = ''
            } else {
                // It's of type ImportCSVResponse
                console.log('INTO ImportCSVResponse', response)
                importCSVResponse.value = response
                modalImportCSVResponse.value = true
                await getCollection()
            }
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknownRetry'),
            })
        }
    }

    const onDrop = async (event: DragEvent) => {
        event.preventDefault()
        await handleFileUpload(event.dataTransfer?.files?.[0] || null)
    }

    const onFileChange = async (event: Event) => {
        console.log('inOnFileChange')
        const target = event.target as HTMLInputElement
        await handleFileUpload(target.files?.[0] || null)
    }

    const onModalImportCollectionClose = () => {
        modalImportCSVResponse.value = false
        importCSVResponse.value = undefined
        modalImportCSVError.value = false
        importCSVError.value = undefined
    }

    return {
        fileInput,
        modalImportCSVResponse,
        importCSVResponse,
        modalImportCSVError,
        importCSVError,
        modalDeleteCollection,
        collection,
        getCollection,
        onDrop,
        onFileChange,
        onModalImportCollectionClose,
        isCollectionLoading,
    }
}
