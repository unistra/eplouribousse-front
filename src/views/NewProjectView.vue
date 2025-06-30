<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import NewProjectStepper from '@/components/newProject/newProjectStepper/NewProjectStepper.vue'
import NewProjectRequirements from '@/components/newProject/newProjectRequirements/newProjectRequirements.vue'
import { ref } from 'vue'

const { t } = useI18n()

const isRequirementValidated = ref<boolean>(false)
</script>

<template>
    <main>
        <h1>{{ t('newProject.title') }}</h1>
        <NewProjectRequirements
            v-if="!isRequirementValidated"
            @validate="isRequirementValidated = true"
        />
        <NewProjectStepper v-else />
    </main>
</template>
