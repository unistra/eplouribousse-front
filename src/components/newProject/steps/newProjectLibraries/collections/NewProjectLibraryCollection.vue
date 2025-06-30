<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NewProjectLibraryCollectionModal from '@/components/newProject/steps/newProjectLibraries/collections/NewProjectLibraryCollectionModal.vue'
import type { Collection, ImportCSVResponse } from '#/project'
import type { Pagination } from '#/pagination.ts'
import { useProjectStore } from '@/stores/projectStore.ts'

const props = defineProps<{
    libraryId: string
    projectId: string
}>()

const { t } = useI18n()
const store = useProjectStore()

const fileInput = ref<HTMLInputElement | null>(null)

const modalImportCollection = ref(false)
const modalDeleteCollection = ref(false)
const importCSVResponse = ref<null | ImportCSVResponse>(null)
const collection = ref<Pagination<Collection> | null>(null)

const getCollection = async () => {
    collection.value = (await store.getCollection(props.libraryId)) || null
}
onMounted(async () => await getCollection())

const handleFileChange = async (file: File) => {
    try {
        importCSVResponse.value = await store.importCollection(file, props.libraryId)
        modalImportCollection.value = true

        await getCollection()
    } catch (error) {
        console.error('Import failed:', error)
    }
}

const onDrop = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer?.files?.length) {
        const file = event.dataTransfer.files[0]
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            handleFileChange(file)
        }
    }
}

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files?.length) {
        const file = target.files[0]
        handleFileChange(file)
    }
}
</script>

<template>
    <p>{{ t('newProject.steps.libraries.collection.title') }}</p>
    <div
        v-if="!collection || collection.results.length === 0"
        class="csv-dropzone"
        @click="fileInput?.click()"
        @dragover.prevent
        @drop="onDrop"
    >
        <input
            ref="fileInput"
            accept=".csv,text/csv"
            style="display: none"
            type="file"
            @change="onFileChange"
        />
        <span>Drag & drop a CSV file here, or click to select</span>
    </div>
    <QCard
        v-else
        class="csv-present"
        flat
    >
        <QCardActions align="right">
            <QBtn
                color="dark"
                flat
                icon="mdi-close"
                size="xs"
                @click="modalDeleteCollection = true"
            />
            <QDialog v-model="modalDeleteCollection">
                <QCard>
                    <QCardSection>
                        <p>{{ t('newProject.steps.libraries.collection.delete.warning') }}</p>
                        <p>{{ t('newProject.steps.libraries.collection.delete.irreversible') }}</p>
                    </QCardSection>
                    <QCardActions align="right">
                        <QBtn
                            color="primary"
                            flat
                            label="Cancel"
                            @click="modalDeleteCollection = false"
                        />
                        <QBtn
                            color="negative"
                            flat
                            label="Delete"
                            @click="store.deleteCollection(libraryId)"
                        />
                    </QCardActions>
                </QCard>
            </QDialog>
        </QCardActions>
        <QCardSection class="content">
            <QIcon
                color="positive"
                name="mdi-check-circle-outline"
                size="sm"
            />
            <p>{{ t('newProject.steps.libraries.collection.present') }}</p>
        </QCardSection>
    </QCard>
    <NewProjectLibraryCollectionModal
        v-model="modalImportCollection"
        :response="importCSVResponse"
    />
</template>

<style lang="scss" scoped>
.csv-dropzone {
    border: 2px dashed #aaa;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
    background: #fafafa;
    transition: border-color 0.2s;
}

.csv-dropzone:hover {
    border-color: #1976d2;
}

.csv-present {
    border: 2px dashed $positive;
    text-align: center;
    border-radius: 8px;
    background: #fafafa;
    transition: border-color 0.2s;

    .q-card__section {
        p {
            margin: 0;
        }

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
}
</style>
