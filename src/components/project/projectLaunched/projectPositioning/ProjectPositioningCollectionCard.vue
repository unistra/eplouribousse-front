<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { CollectionPosition, CollectionsInResource } from '#/project'
import { computed, ref } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
const props = defineProps<{
    libraryId: string
    collection: CollectionsInResource
}>()

const { t } = useI18n()
const resourceStore = useResourceStore()

const collection = resourceStore.collections.find((col) => col.id === props.collection.id)
const newPosition = ref<CollectionPosition>(collection?.position || null)

const hasPositioningChanged = computed(() => collection?.position !== newPosition.value)
const saveBtnLoading = ref<boolean>(false)

const onSave = async () => {
    if (!collection) return
    saveBtnLoading.value = true
    await resourceStore.updatePosition(collection.id, newPosition.value)
    saveBtnLoading.value = false
}
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
            <QCardSection
                v-if="collection.acl.position"
                class="button-section"
            >
                <QRadio
                    v-for="position in [1, 2, 3, 4]"
                    :key="position"
                    v-model="newPosition"
                    color="primary"
                    :label="position.toString()"
                    no-border
                    size="xl"
                    :val="position"
                />
            </QCardSection>
            <QCardSection v-else>
                <p>
                    Position:
                    <span :class="['position', { italic: !collection.position }]">{{
                        collection.position || t('common.undefined')
                    }}</span>
                </p>
            </QCardSection>
        </QCardSection>

        <QCardActions
            v-if="hasPositioningChanged"
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
.button-section
    display: flex
    justify-content: center
</style>
