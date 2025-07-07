<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import NewProjectLibraryAdd from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraryAdd.vue'
import NewProjectLibraryCard from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraryCard.vue'

const { t } = useI18n()
const store = useProjectStore()
</script>

<template>
    <p>{{ t('newProject.steps.libraries.description') }}</p>
    <div class="container">
        <template v-if="store.libraries.length > 0">
            <NewProjectLibraryCard
                v-for="library in store.libraries"
                :key="library.id"
                :library="library"
            />
        </template>

        <NewProjectLibraryAdd />
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}
</style>
