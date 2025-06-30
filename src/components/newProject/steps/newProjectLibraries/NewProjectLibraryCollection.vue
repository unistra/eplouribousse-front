<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'

const props = defineProps<{
    libraryId: string
    projectId: string
}>()

const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = async (file: File) => {
    const formData = new FormData()
    formData.append('csv_file', file)
    formData.append('library', props.libraryId)
    formData.append('project', props.projectId)

    try {
        const response = await axiosI.post('/collections/import-csv/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log('Import response:', response)
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
    <p>{{ t('newProject.steps.libraries.collection') }}</p>
    <div
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
</template>

<style scoped>
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
</style>
