<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import ProjectPositioningCollectionCard from '@/components/project/projectLaunched/projectPositioning/projectPositioningCollectionCard/ProjectPositioningCollectionCard.vue'
import { useI18n } from 'vue-i18n'
import { Arbitration } from '&/project.ts'
import { computed } from 'vue'
import type { CollectionsInResource, ProjectLibrary } from '#/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useResourcesStore } from '@/stores/resourcesStore.ts'

const resourceStore = useResourceStore()
const resourcesStore = useResourcesStore()
const projectStore = useProjectStore()
const { t } = useI18n()

const librariesAssociated = computed<ProjectLibrary[]>(() => {
    if (!projectStore.project) return []
    return (
        projectStore.project.libraries
            .filter((lib) => resourceStore.collections.some((el: CollectionsInResource) => el.library === lib.id))
            .sort((a: ProjectLibrary, b: ProjectLibrary) => {
                const aIsSelected = a.id === resourcesStore.libraryIdSelected
                const bIsSelected = b.id === resourcesStore.libraryIdSelected

                if (aIsSelected === bIsSelected) return 0
                return aIsSelected ? -1 : 1
            }) || []
    )
})
</script>

<template>
    <div class="project-positioning">
        <QCard
            v-if="resourceStore.resource?.arbitration !== Arbitration.NoArbitration"
            class="arbitration-card"
            dark
            flat
        >
            <QCardSection>
                <p>{{ t('project.positioning.arbitration.i') }}</p>
            </QCardSection>
            <QCardSection>
                <p>{{ t('project.positioning.arbitration.currently') }}</p>
                <p>
                    {{
                        resourceStore.resource?.arbitration == Arbitration.NoPosition1
                            ? t('project.positioning.arbitration.type0')
                            : t('project.positioning.arbitration.type1')
                    }}
                </p>
            </QCardSection>
        </QCard>
        <QCard
            v-for="library in librariesAssociated"
            :key="library.id"
        >
            <QCardSection>
                <p>{{ library.name }}</p>
            </QCardSection>
            <QCardSection>
                <ProjectPositioningCollectionCard
                    v-for="collection in resourceStore.collections.filter((el) => el.library === library.id)"
                    :key="collection.id"
                    :collection="collection"
                    :library-id="library.id"
                />
            </QCardSection>
        </QCard>
    </div>
</template>

<style scoped lang="sass">
.spinner
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 1
.project-positioning
    display: flex
    flex-direction: column
    gap: 1rem
    width: 100%

    .button-section
        display: flex
        gap: 1rem
</style>
