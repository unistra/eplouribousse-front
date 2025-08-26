<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import ProjectPositioningCollectionCard from '@/components/project/projectLaunched/projectPositioning/projectPositioningCollectionCard/ProjectPositioningCollectionCard.vue'
import { Arbitration } from '#/project.ts'

const props = defineProps<{
    resourceId: string
}>()

const resourceStore = useResourceStore()
const loading = ref<boolean>(false)

onMounted(async () => {
    loading.value = true
    await resourceStore.fetchResourceAndCollections(props.resourceId)
    loading.value = false
})
</script>

<template>
    <div
        v-if="loading"
        class="spinner"
    >
        <QSpinner size="2rem" />
    </div>
    <div
        v-else
        class="project-positioning"
    >
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
                    <p>Arbitrage</p>
                </QCardSection>
                <QCardSection>
                    <p>Cette ressource est en cours d'arbitrage</p>
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
