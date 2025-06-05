<script lang="ts" setup>
import type { LibraryI } from '#/library'
import { useNewProjectStore } from '@/stores/newProjectStore.ts'

defineProps<{
    library: LibraryI
}>()

const { removeLibrary } = useNewProjectStore()
</script>

<template>
    <QCard
        class="base-card library-card"
        flat
    >
        <QCardSection>
            <p>{{ library.name }}</p>
            <p>{{ library.alias }}</p>
            <p>{{ library.code }}</p>
        </QCardSection>
        <QCardActions align="right">
            <QBtn
                flat
                @click="() => removeLibrary(library)"
            >
                <QIcon name="mdi-delete" />
            </QBtn>
        </QCardActions>
    </QCard>
</template>

<style scoped>
.q-card {
    width: 100%;
    max-width: 400px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 4px solid #e4e4e4;
}
</style>
