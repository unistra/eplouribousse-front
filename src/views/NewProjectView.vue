<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import NewProjectRequirements from '@/components/newProject/newProjectRequirements/newProjectRequirements.vue'
import NewProjectUsers from '@/components/newProject/newProjectUsers/NewProjectUsers.vue'

const { t } = useI18n()
</script>

<template>
    <main>
        <h1>{{ t('newProject.creation.title') }}</h1>
        <NewProjectRequirements />
        <NewProjectUsers />
    </main>
</template>
