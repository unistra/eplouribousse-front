import { ref } from 'vue'
import type { Collection, ImportCSVError, ImportCSVResponse } from '#/project.ts'
import type { Pagination } from '#/pagination.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { isAxiosError } from 'axios'

export const useProjectLibraryCollection = (libraryId: string) => {
    const projectStore = useProjectStore()
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { useHandleError } = useUtils()

    const fileInput = ref<HTMLInputElement | null>(null)
    const csvImportLoading = ref(false)
    const collection = ref<Pagination<Collection> | null | undefined>(undefined)
    const importCSVResponse = ref<ImportCSVResponse | undefined>(undefined)
    const importCSVError = ref<ImportCSVError | undefined>(undefined)

    const onDrop = async (event: DragEvent) => {
        await handleFileUpload(event.dataTransfer?.files?.[0] || null)
    }

    const onFileChange = async (event: Event) => {
        const target = event.target as HTMLInputElement
        await handleFileUpload(target.files?.[0] || null)
    }

    const onModalImportCollectionClose = () => {
        importCSVResponse.value = undefined
        importCSVError.value = undefined
    }

    const getCollection = async () => {
        csvImportLoading.value = true

        try {
            const response = await axiosI.get<Pagination<Collection>>('/collections/', {
                params: {
                    library: libraryId,
                    project: projectStore.id,
                },
            })

            if (!projectStore.librariesIdThatHaveACollectionImported.includes(libraryId) && response.data.count)
                projectStore.librariesIdThatHaveACollectionImported.push(libraryId)
            collection.value = response.data
        } catch (e) {
            useHandleError(e)
        } finally {
            csvImportLoading.value = false
        }
    }

    const handleFileUpload = async (file: File | null) => {
        if (!file || !(file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            notify({
                type: 'negative',
                message: t('project.libraries.card.csv-import.errors.wrongExtension'),
            })
            return
        }

        csvImportLoading.value = true
        try {
            const formData = new FormData()
            formData.append('csv_file', file)
            formData.append('library', libraryId)
            formData.append('project', projectStore.id)

            const response = await axiosI.post<ImportCSVResponse>('/collections/import-csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            importCSVResponse.value = response.data
            await getCollection()
        } catch (e) {
            if (isAxiosError(e)) {
                importCSVError.value = e.response?.data.csvFile
                if (fileInput.value) fileInput.value.value = ''
            } else {
                useHandleError(e)
            }
        } finally {
            csvImportLoading.value = false
        }
    }

    const deleteCollection = async (libraryId: string) => {
        csvImportLoading.value = true
        try {
            await axiosI.delete('/collections/bulk-delete/', {
                params: {
                    library_id: libraryId,
                    project_id: projectStore.id,
                },
            })
            collection.value = undefined
            notify({
                message: t('project.libraries.card.csv-import.delete.success'),
            })
        } catch (e) {
            useHandleError(e)
        } finally {
            csvImportLoading.value = false
        }
    }

    return {
        fileInput,
        importCSVResponse,
        importCSVError,
        collection,
        getCollection,
        onDrop,
        onFileChange,
        onModalImportCollectionClose,
        csvImportLoading,
        deleteCollection,
    }
}
