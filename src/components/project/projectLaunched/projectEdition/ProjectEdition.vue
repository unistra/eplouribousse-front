<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'
import type { CollectionsInResource } from '#/project.ts'
import { useProjectEdition } from '@/components/project/projectLaunched/projectEdition/useProjectEdition.ts'
import { onMounted } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const resourceStore = useResourceStore()
const { t } = useI18n()

const { selectCollectionToShowEdition, motherCollectionString, pdfPreviewURL, storageLocation } = useProjectEdition()

onMounted(() => {
    selectCollectionToShowEdition.value = resourceStore.collectionsSortedByOrderInInstructionTurns.filter((el) =>
        resourceStore.libraryIdSelected ? el.library === resourceStore.libraryIdSelected : true,
    )[0]
})
</script>

<template>
    <div class="edition">
        <div class="generic-info">
            <h3>{{ t('common.info', 2) }}</h3>
            <div class="other-infos">
                <QChip class="chip-with-bold">
                    {{ t('project.storageLocation') }}: <span>{{ storageLocation }}</span>
                </QChip>
                <QChip class="chip-with-bold">{{ t('project.resources.status.controlBound') }}: <span>-</span></QChip>
                <QChip class="chip-with-bold">{{ t('project.resources.status.controlUnbound') }}: <span>-</span></QChip>
            </div>
            <QList class="collection-lists">
                <QExpansionItem
                    class="collection-chip"
                    default-opened
                    dense
                    dense-toggle
                    header-class="expansion-item"
                    :label="t('project.resources.resultant.motherCollection')"
                >
                    <QCard>
                        <QIcon name="mdi-arrow-right-bottom" />
                        <QItemSection>
                            <QChip class="mother-collection-string"> {{ motherCollectionString }} </QChip>
                        </QItemSection>
                    </QCard>
                </QExpansionItem>
                <QExpansionItem
                    class="collection-chip"
                    dense
                    dense-toggle
                    header-class="expansion-item"
                    :label="t('project.resources.resultant.participatingCollections')"
                >
                    <QCard>
                        <QIcon name="mdi-arrow-right-bottom" />
                        <QChip
                            v-for="collection in resourceStore.collectionsSortedByOrderInInstructionTurns"
                            :key="collection.id"
                        >
                            {{ resourceStore.formatCollectionToString(collection) }}
                        </QChip>
                    </QCard>
                </QExpansionItem>
                <QExpansionItem
                    v-if="resourceStore.collections.filter((collection) => collection.isExcluded).length"
                    class="collection-chip"
                    dense
                    dense-toggle
                    header-class="expansion-item"
                    :label="t('project.resources.resultant.excludeCollections')"
                >
                    <QCard>
                        <QIcon name="mdi-arrow-right-bottom" />
                        <QChip
                            v-for="collection in resourceStore.collections.filter((col) => col.isExcluded)"
                            :key="collection.id"
                        >
                            {{ resourceStore.formatCollectionToString(collection) }}
                        </QChip>
                    </QCard>
                </QExpansionItem>
            </QList>
        </div>
        <div class="collection-container">
            <h3>{{ t('project.collection.i') }}</h3>
            <div class="select-and-pdf-container">
                <div class="collection-select-and-infos">
                    <AtomicSelect
                        v-model="selectCollectionToShowEdition"
                        dense
                        emit-value
                        :label="t('project.resources.resultant.selectCollection')"
                        map-options
                        name="filter-positioning"
                        :option-label="(el: CollectionsInResource) => resourceStore.formatCollectionToString(el)"
                        :option-value="(el: CollectionsInResource) => el"
                        :options="
                            resourceStore.collectionsSortedByOrderInInstructionTurns.filter((el) =>
                                resourceStore.libraryIdSelected ? el.library === resourceStore.libraryIdSelected : true,
                            )
                        "
                    />
                    <QChip class="chip-with-bold">
                        {{ t('project.resources.callNumber') }}:
                        <span>{{ selectCollectionToShowEdition?.callNumber || '-' }}</span>
                    </QChip>
                    <QChip class="chip-with-bold">
                        {{ t('project.resources.holdStatement') }}:
                        <span>{{ selectCollectionToShowEdition?.holdStatement || '-' }}</span>
                    </QChip>
                </div>

                <div class="pdf">
                    <div class="label">
                        <QIcon name="mdi-file-outline" />
                        <p>PDF</p>
                    </div>
                    <div class="buttons">
                        <AtomicButton
                            dense
                            :href="pdfPreviewURL()"
                            icon="mdi-eye"
                            :label="t('common.preview')"
                            target="_blank"
                        />
                        <AtomicButton
                            dense
                            :href="pdfPreviewURL(false)"
                            icon="mdi-download"
                            :label="t('common.download')"
                        />
                    </div>
                </div>
            </div>
        </div>
        <QChip
            class="info"
            icon="mdi-information"
            >{{ t('project.resources.resultant.infos') }}</QChip
        >
        <ProjectSegmentTable />
    </div>
</template>

<style scoped lang="sass">
h3
    font-size: 1.1rem
    font-weight: bold
.edition
    display: flex
    flex-direction: column
    width: 100%
    gap: 2rem
    position: relative

    .generic-info
        display: flex
        flex-direction: column
        gap: 1rem

        .collection-lists
            display: flex
            align-items: start
            .collection-chip
                display: flex
                flex-wrap: wrap
                align-items: center
                .mother-collection-string
                    width: fit-content
                .q-card
                    padding-left: 1.5rem
                    display: flex
                    align-items: center
                    flex-wrap: wrap

                    .q-chip
                        border-radius: 3rem
        ::v-deep(.expansion-item)
            border-radius: 3rem
            text-wrap: nowrap
        .other-infos
            display: flex
            align-items: center

    .collection-container
        display: flex
        flex-direction: column
        gap: 0.5rem
        position: sticky
        top: 0
        z-index: 1000
        background-color: var(--color-white)
        padding-bottom: 0.5rem
        padding-top: 0.5rem

        .select-and-pdf-container
            display: flex
            align-items: center
            .collection-select-and-infos
                display: flex
                align-items: center
                flex-wrap: wrap
                gap: 0.3rem
                flex-grow: 1
                text-wrap: wrap
                .q-select
                    width: 100%
                    max-width: 300px


    .chip-with-bold
        span
            margin-left: 0.2rem
            font-weight: bold

    .info
        width: fit-content
        background-color: var(--color-blue)
        color: var(--color-white)
        align-self: center
        ::v-deep(.q-chip__icon)
            color: var(--color-white)

    .pdf
        display: flex
        align-items: center
        gap: 1rem
        align-self: end
        .label
            display: flex
            align-items: center
        .buttons
            display: flex
            align-items: center
            gap: 0.5rem
</style>
