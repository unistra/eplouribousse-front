<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import ProjectLibraryCard from '@/components/project/libraries/card/ProjectLibraryCard.vue'
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'
import { useProjectLibraries } from '@/components/project/libraries/useProjectLibraries.ts'

const { t } = useI18n()
const projectStore = useProjectStore()

const { onAddLibrary, addLibraryDialog } = useProjectLibraries()
</script>

<template>
    <div class="container">
        <h1>{{ t('view.project.new.stepper.steps.libraries.title') }}</h1>
        <div>
            <template v-if="projectStore.libraries.length">
                <ProjectLibraryCard
                    v-for="library in projectStore.libraries"
                    :key="library.id"
                    class="library-card selected"
                    :library="library"
                />
            </template>

            <QCard
                v-if="projectStore.acl.addLibrary"
                class="library-card add"
                flat
                @click="addLibraryDialog = true"
            >
                <QIcon
                    name="mdi-plus-circle-outline"
                    size="2rem"
                />
                <QDialog v-model="addLibraryDialog">
                    <QCard>
                        <QCardSection>
                            <p>{{ t('libraries.i') }}</p>
                        </QCardSection>
                        <QCardSection>
                            <p>{{ t('libraries.list') }}</p>
                            <LibraryTable
                                :libraries-selected="projectStore.libraries"
                                :with-add-btn="true"
                                @selected="onAddLibrary"
                            />
                        </QCardSection>
                    </QCard>
                </QDialog>
            </QCard>
        </div>
    </div>
</template>

<style scoped lang="sass">
.container
    display: flex
    flex-direction: column
    gap: 2rem

    h1
        font-size: var(--font-size-xl)
    &>div
        display: flex
        flex-wrap: wrap
        gap: 16px

        .library-card
            width: 100%
            max-width: 24rem
            display: flex
            height: fit-content

            &.selected
                flex-direction: column
                gap: 0.5rem
                border: 2px solid var(--color-neutral-200)
                border-radius: var(--border-radius)
            &.add
                height: 12rem
                justify-content: center
                align-items: center
                border: 4px dotted var(--color-neutral-300)
                border-radius: var(--border-radius)
                cursor: pointer

                .q-icon
                    color: var(--color-neutral-300)
</style>
