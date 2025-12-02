import { computed, reactive, ref, toRefs } from 'vue'
import type { Collection, ImportCSVError, ImportCSVResponse } from '#/project.ts'
import type { Pagination } from '#/pagination.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { isAxiosError } from 'axios'
import type { LibraryI } from '#/library'

const state = reactive<{ csvImportLoading: LibraryI['id'][] }>({
    csvImportLoading: [],
})

export const useProjectLibraryCollection = (libraryId: string = '') => {
    const projectStore = useProjectStore()
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { useHandleError } = useUtils()

    const fileInput = ref<HTMLInputElement | null>(null)
    const collectionCount = computed<number | undefined>(() => {
        return projectStore.collectionsCount.find((el) => el.libraryId === libraryId)?.count
    })
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
        if (projectStore.collectionsCount.some((el) => el.libraryId === libraryId)) return
        state.csvImportLoading.push(libraryId)

        try {
            const response = await axiosI.get<Pagination<Collection>>('/collections/', {
                params: {
                    library: libraryId,
                    project: projectStore.project?.id || '',
                },
            })

            if (response.data.count && !projectStore.collectionsCount.some((el) => el.libraryId === libraryId))
                projectStore.collectionsCount.push({ libraryId, count: response.data.count })
        } catch (e) {
            useHandleError(e)
        } finally {
            state.csvImportLoading = state.csvImportLoading.filter((id) => id !== libraryId)
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

        state.csvImportLoading.push(libraryId)
        try {
            const formData = new FormData()
            formData.append('csv_file', file)
            formData.append('library', libraryId)
            formData.append('project', projectStore.project?.id || '')

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
            state.csvImportLoading = state.csvImportLoading.filter((id) => id !== libraryId)
        }
    }

    const deleteCollection = async (libraryId: string) => {
        state.csvImportLoading.push(libraryId)
        try {
            await axiosI.delete('/collections/bulk-delete/', {
                params: {
                    library_id: libraryId,
                    project_id: projectStore.project?.id || '',
                },
            })
            projectStore.collectionsCount = projectStore.collectionsCount.filter((el) => el.libraryId !== libraryId)
            notify({
                message: t('project.libraries.card.csv-import.delete.success'),
            })
        } catch (e) {
            useHandleError(e)
        } finally {
            state.csvImportLoading = state.csvImportLoading.filter((id) => id !== libraryId)
        }
    }

    return {
        fileInput,
        importCSVResponse,
        importCSVError,
        collectionCount,
        getCollection,
        onDrop,
        onFileChange,
        onModalImportCollectionClose,
        ...toRefs(state),
        deleteCollection,
    }
}
