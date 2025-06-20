<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useNewProjectStore } from '@/stores/newProjectStore.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { projectName, projectDescription } = storeToRefs(useNewProjectStore())
</script>

<template>
    <div class="container column align-center">
        <QInput
            v-model="projectName"
            class="container-item"
            :label="t('newProject.steps.informations.name')"
            type="text"
        />
        <QInput
            v-model="projectDescription"
            class="container-item"
            :label="t('newProject.steps.informations.description')"
            type="textarea"
        />
    </div>
</template>

<style scoped></style>
