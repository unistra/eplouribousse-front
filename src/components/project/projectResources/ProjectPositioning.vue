<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'

const props = defineProps<{
    resourceId: string
    libraryIdSelected: string
}>()

const { t } = useI18n()
const resourceStore = useResourceStore()

onMounted(async () => {
    await resourceStore.fetchResourceAndCollections(props.resourceId, props.libraryIdSelected)
})
</script>

<template>
    <div class="project-positioning">
        <hgroup>
            <h2>{{ resourceStore.title }}</h2>
            <p>{{ resourceStore.code }}</p>
        </hgroup>
        <QCard
            v-for="library in resourceStore.librariesAssociated"
            :key="library.id"
        >
            <QCardSection>
                <QCardSection>
                    <p>{{ library.name }}</p>
                </QCardSection>
                <QCard
                    v-for="collection in resourceStore.collections.filter((el) => el.library === library.id)"
                    :key="collection.id"
                >
                    <QCardSection>
                        <p>{{ collection }}</p>
                        <p>{{ collection?.callNumber || t('project.resources.noCallNumber') }}</p>
                        <p>{{ collection?.holdStatement || t('project.resources.noHoldStatement') }}</p>
                    </QCardSection>
                    <QCardSection class="button-section">
                        <QRadio
                            v-for="position in [1, 2, 3, 4]"
                            :key="position"
                            v-model="collection.position"
                            color="primary"
                            :label="position.toString()"
                            no-border
                            size="xl"
                            :val="position"
                        />
                    </QCardSection>
                    <QCardSection>
                        <p>{{ t('project.resources.position') }}: {{ collection.position }}</p>
                    </QCardSection>
                </QCard>
            </QCardSection>
        </QCard>
    </div>
</template>

<style scoped lang="sass">
.project-positioning
    display: flex
    flex-direction: column
    gap: 1rem

    .button-section
        display: flex
        gap: 1rem
</style>
