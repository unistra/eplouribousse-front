<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type CollectionsInResource } from '#/project.ts'
import { onMounted, watch } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { useProjectPositioningCollectionCard } from '@/components/project/projectLaunched/projectPositioning/projectPositioningCollectionCard/useProjectPositioningCollectionCard.ts'
import { CollectionPosition } from '&/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
const props = defineProps<{
    libraryId: string
    collection: CollectionsInResource
}>()

const { t } = useI18n()
const projectStore = useProjectStore()
const resourceStore = useResourceStore()

const { collection, exclude, comment, exclusionReason, newPosition, onSave, showSaveBtn, saveBtnLoading } =
    useProjectPositioningCollectionCard(props.collection.id)

watch(exclude, () => {
    if (exclude.value) newPosition.value = CollectionPosition.Undefined
    else newPosition.value = collection?.position || CollectionPosition.Position4
})

onMounted(() => {
    exclude.value = !!collection?.exclusionReason
    exclusionReason.value = collection?.exclusionReason || ''
    comment.value = collection?.commentPositioning?.content || ''
})
</script>

<template>
    <QCard v-if="collection">
        <QCardSection
            class="q-card-section-horizontal"
            horizontal
        >
            <QCardSection>
                <p>
                    {{ t('project.resources.callNumber') }}:
                    {{ collection.callNumber || t('project.resources.noCallNumber') }}
                </p>
                <p>
                    {{ t('project.resources.holdStatement') }}:
                    {{ collection.holdStatement || t('project.resources.noHoldStatement') }}
                </p>
            </QCardSection>
            <QCardSection v-if="collection.acl.position && resourceStore.libraryIdSelected === libraryId">
                <QForm @submit.prevent>
                    <div class="button-section">
                        <QRadio
                            v-for="position in [
                                CollectionPosition.Position1,
                                CollectionPosition.Position2,
                                CollectionPosition.Position3,
                                CollectionPosition.Position4,
                            ]"
                            :key="position"
                            v-model="newPosition"
                            color="primary"
                            :disable="exclude"
                            :label="position.toString()"
                            no-border
                            size="xl"
                            :val="position"
                        />
                    </div>
                    <QCheckbox
                        v-model="exclude"
                        :label="t('project.resources.exclusion.exclude')"
                    />
                    <AtomicSelect
                        v-if="exclude"
                        v-model="exclusionReason"
                        :label="t('project.resources.exclusion.exclusionReason')"
                        :options="projectStore.settings.exclusionReasons"
                    />
                    <AtomicInput
                        v-model="comment"
                        :label="t('project.resources.comment')"
                    />
                </QForm>
            </QCardSection>
            <QCardSection v-else>
                <p v-if="!collection.exclusionReason">
                    {{ t('project.resources.position') }}:
                    <span :class="['position', { italic: !collection.position }]">{{
                        collection.position || t('common.undefined')
                    }}</span>
                </p>
                <p v-else>
                    {{ t('project.resources.exclusion.excluded') }}:
                    <span :class="['position', { italic: !collection.position }]">{{
                        collection.exclusionReason
                    }}</span>
                </p>
                <p v-if="collection.commentPositioning && collection.commentPositioning.content">
                    {{ t('project.resources.comment') }}:
                    {{ collection.commentPositioning.content }}
                </p>
            </QCardSection>
        </QCardSection>

        <QCardActions
            v-if="showSaveBtn"
            align="right"
        >
            <AtomicButton
                :label="t('common.save')"
                :loading="saveBtnLoading"
                @click="onSave"
            />
        </QCardActions>
    </QCard>

    <QCard v-else>
        <p>{{ t('errors.unknownRetry') }}</p>
    </QCard>
</template>

<style lang="sass" scoped>
.q-card-section-horizontal
    justify-content: space-between
    align-items: center

    .position
        font-size: 1.2rem
        font-weight: bold

        &.italic
            font-style: italic

    .q-form
        display: flex
        flex-direction: column
        gap: 1rem
.button-section
    display: flex
    justify-content: center
</style>
