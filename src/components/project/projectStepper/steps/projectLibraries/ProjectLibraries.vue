<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import ProjectLibraryCard from '@/components/project/projectStepper/steps/projectLibraries/ProjectLibraryCard.vue'
import ProjectLibraryAdd from '@/components/project/projectStepper/steps/projectLibraries/ProjectLibraryAdd.vue'

const { t } = useI18n()
const store = useProjectStore()
</script>

<template>
    <p>{{ t('newProject.steps.libraries.description') }}</p>
    <div class="container">
        <template v-if="store.libraries.length > 0">
            <ProjectLibraryCard
                v-for="library in store.libraries"
                :key="library.id"
                :library="library"
            />
        </template>

        <ProjectLibraryAdd />
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}
</style>
