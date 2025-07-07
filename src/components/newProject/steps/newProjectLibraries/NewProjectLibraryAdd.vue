<script lang="ts" setup>
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'
import { ref } from 'vue'
import type { LibraryI } from '#/library'
import { useProjectStore } from '@/stores/projectStore.ts'

const store = useProjectStore()

const dialog = ref(false)
const onSelected = (library: LibraryI) => {
    dialog.value = false
    store.addLibrary(library)
}
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
                    :libraries-selected="store.libraries"
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
