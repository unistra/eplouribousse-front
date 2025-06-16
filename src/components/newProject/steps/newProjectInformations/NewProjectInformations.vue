<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useNewProjectStore } from '@/stores/newProjectStore.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { projectName, projectDescription } = storeToRefs(useNewProjectStore())
</script>

<template>
    <div class="container-column">
        <QInput
            v-model="projectName"
            :label="t('newProject.steps.informations.name')"
            type="text"
            class="container-item"
        />
        <QInput
            v-model="projectDescription"
            :label="t('newProject.steps.informations.description')"
            type="textarea"
            class="container-item"
        />
    </div>
</template>

<style scoped></style>
