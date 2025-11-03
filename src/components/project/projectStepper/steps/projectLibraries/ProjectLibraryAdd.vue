<script lang="ts" setup>
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'
import { ref } from 'vue'
import type { LibraryI } from '#/library'
import { useProjectStore } from '@/stores/projectStore.ts'

const store = useProjectStore()

const dialog = ref(false)
const cursor = store.acl.addLibrary ? 'can-add-cursor' : 'cannot-add-cursor'
const onSelected = (library: LibraryI) => {
    dialog.value = false
    store.addLibrary(library)
}
</script>

<template>
    <QCard
        :class="'placeholder-card ' + cursor"
        flat
        @click="() => (dialog = store.acl.addLibrary)"
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

<style scoped lang="sass">
.placeholder-card
    width: 100%
    max-width: 400px
    height: 200px
    display: flex
    border: 4px dotted var(--color-neutral-300)
    border-radius: 8px
    justify-content: center
    align-items: center

    .q-icon
        font-size: var(--font-size-4xl)
        color: var(--color-neutral-300)

.can-add-cursor
    cursor: pointer

.cannot-add-cursor
    cursor: not-allowed
</style>
