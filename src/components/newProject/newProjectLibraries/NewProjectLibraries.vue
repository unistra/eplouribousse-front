<script lang="ts" setup>
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'
import { ref } from 'vue'

const dialog = ref(false)
</script>

<template>
    <p>Inserer les bibliothèque participantes</p>
    <QBtn
        color="primary"
        label="Bibliothèques"
        @click="() => (dialog = true)"
    />
    <QDialog v-model="dialog">
        <QCard>
            <QCardSection>
                <p>Bibliothèques</p>
            </QCardSection>
            <QCardSection>
                <p>Liste des bibliothèques</p>
                <LibraryTable
                    :with-add-btn="true"
                    @selected="(selected) => console.log('selected', selected)"
                />
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style scoped></style>
