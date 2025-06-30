<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useNewProjectStore } from '@/stores/newProjectStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()
const { projectName, projectDescription } = storeToRefs(useNewProjectStore())
</script>

<template>
    <div class="container column content-center">
        <div class="container column very-large">
            <AtomicInput
                class="container-item"
                :label="t('newProject.steps.informations.name')"
                :model="projectName"
                type="text"
                @update:model="projectName = $event as string"
            />
            <AtomicInput
                class="container-item"
                :label="t('newProject.steps.informations.description')"
                :model="projectDescription"
                type="textarea"
                @update:model="projectDescription = $event as string"
            />
        </div>
    </div>
</template>

<style scoped></style>
