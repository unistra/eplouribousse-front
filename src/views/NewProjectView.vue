<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'

const { t } = useI18n()
</script>

<template>
    <main>
        <h1>{{ t('newProject.title') }}</h1>
        <!--        <NewProjectRequirements />-->
        <NewProjectStepper />
        <!--        <NewProjectUsers />-->
    </main>
</template>
