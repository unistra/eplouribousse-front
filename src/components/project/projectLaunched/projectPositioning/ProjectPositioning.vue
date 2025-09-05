<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import ProjectPositioningCollectionCard from '@/components/project/projectLaunched/projectPositioning/projectPositioningCollectionCard/ProjectPositioningCollectionCard.vue'
import { Arbitration } from '&/project.ts'

import { useI18n } from 'vue-i18n'

const resourceStore = useResourceStore()
const { t } = useI18n()
</script>

<template>
    <div class="project-positioning">
        <hgroup>
            <h2>{{ resourceStore.title }}</h2>
            <p>{{ resourceStore.code }}</p>

            <QCard
                v-if="resourceStore.arbitration !== Arbitration.NoArbitration"
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
                            resourceStore.arbitration == Arbitration.NoPosition1
                                ? t('project.positioning.arbitration.type0')
                                : t('project.positioning.arbitration.type1')
                        }}
                    </p>
                </QCardSection>
            </QCard>
        </hgroup>
        <QCard
            v-for="library in resourceStore.librariesAssociated"
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
                    :library-id-selected="resourceStore.libraryIdSelected"
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

    .button-section
        display: flex
        gap: 1rem
</style>
