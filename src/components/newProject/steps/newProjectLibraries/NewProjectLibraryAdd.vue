<script lang="ts" setup>
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'
import { ref } from 'vue'
import type { LibraryI } from '#/library'
import { useNewProjectStore } from '@/stores/newProjectStore.ts'
import { storeToRefs } from 'pinia'

const { addLibrary } = useNewProjectStore()

const dialog = ref(false)
const onSelected = (library: LibraryI) => {
    dialog.value = false
    addLibrary(library)
}

const { projectLibraries } = storeToRefs(useNewProjectStore())
</script>

<template>
    <QCard
        class="placeholder-card"
        flat
        @click="() => (dialog = true)"
    >
        <QIcon name="mdi-plus-circle-outline" />
    </QCard>
    <QDialog v-model="dialog">
        <QCard>
            <QCardSection>
                <p>Bibliothèques</p>
            </QCardSection>
            <QCardSection>
                <p>Liste des bibliothèques</p>
                <LibraryTable
                    :library-selected="projectLibraries"
                    :with-add-btn="true"
                    @selected="onSelected"
                />
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style scoped>
.placeholder-card {
    width: 100%;
    max-width: 400px;
    height: 200px;
    display: flex;
    border: 4px dotted lightgray;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .q-icon {
        font-size: 36px;
        color: lightgray;
    }
}
</style>
