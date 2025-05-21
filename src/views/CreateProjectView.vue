<script setup lang="ts">
import CreateProjectForm from '@/components/forms/createProjectForm/CreateProjectForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <main>
        <h1 style="text-align: center">{{ t('newProject.creation.title') }}</h1>
        <div class="row">
            <div class="col-6">
                <CreateProjectForm />
            </div>
        </div>
    </main>
</template>
