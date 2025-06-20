<script lang="ts" setup>
import NewProjectLibraryCard from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraryCard.vue'
import { storeToRefs } from 'pinia'
import { useNewProjectStore } from '@/stores/newProjectStore.ts'
import NewProjectLibraryAdd from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraryAdd.vue'

const { projectLibraries } = storeToRefs(useNewProjectStore())
</script>

<template>
    <p>Inserer les bibliothèque participantes</p>
    <div class="container-row">
        <template v-if="projectLibraries.length > 0">
            <NewProjectLibraryCard
                v-for="library in projectLibraries"
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
