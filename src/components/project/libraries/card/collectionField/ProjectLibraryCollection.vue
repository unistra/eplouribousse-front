<script lang="ts" setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import type { ImportCSVErrorObject } from '#/project.ts'
import { useProjectLibraryCollection } from '@/components/project/libraries/card/collectionField/useProjectLibraryCollection.ts'

const props = defineProps<{
    libraryId: string
    summaryMode?: boolean
}>()

const { t } = useI18n()
const {
    getCollection,
    collectionCount,
    importCSVResponse,
    importCSVError,
    fileInput,
    onDrop,
    onFileChange,
    onModalImportCollectionClose,
    csvImportLoading,
    deleteCollection,
} = useProjectLibraryCollection(props.libraryId)

onMounted(async () => await getCollection())
</script>

<template>
    <p>{{ t('collection.i') }}</p>
    <QCard
        :class="['csv-card', { present: !!collectionCount, error: !!importCSVError }]"
        flat
    >
        <QInnerLoading :showing="csvImportLoading.includes(libraryId)" />

        <template v-if="!summaryMode">
            <QCardSection
                v-if="!collectionCount"
                class="csv-input"
                @click="fileInput?.click()"
                @dragover.prevent
                @drop.prevent="onDrop"
            >
                <input
                    ref="fileInput"
                    accept=".csv,text/csv"
                    type="file"
                    @change.prevent="onFileChange"
                />
                <QIcon
                    name="mdi-file-upload-outline"
                    size="1.5rem"
                />
                <span>{{ t('project.libraries.card.csv-import.dragAndDrop') }}</span>
            </QCardSection>

            <template v-else>
                <QCardSection class="section-before-action">
                    <QIcon
                        color="positive"
                        name="mdi-check-circle-outline"
                        size="sm"
                    />
                    <p>
                        {{ t('project.libraries.card.csv-import.present', { count: collectionCount }) }}
                    </p>
                </QCardSection>
                <QCardActions align="right">
                    <AtomicButton
                        confirm-button-color="negative"
                        icon="mdi-delete-outline"
                        no-border
                        require-confirmation
                        size="sm"
                        @confirm="deleteCollection(libraryId)"
                    />
                </QCardActions>
            </template>

            <QDialog
                :model-value="!!importCSVResponse"
                persistent
            >
                <QCard>
                    <QCardSection>
                        <p>
                            <QIcon
                                color="positive"
                                name="mdi-check-circle-outline"
                            />
                            {{ t('project.libraries.card.csv-import.importSuccess') }}
                        </p>
                        <p>{{ t('project.libraries.card.csv-import.weFound') }}:</p>
                        <ul>
                            <li
                                v-for="(count, key) in importCSVResponse"
                                :key="key"
                            >
                                {{ t('project.libraries.card.csv-import.elementPresent', { count, times: key }) }}
                            </li>
                        </ul>
                    </QCardSection>

                    <QCardActions align="right">
                        <AtomicButton
                            color="primary"
                            :label="t('common.continue')"
                            @click="onModalImportCollectionClose"
                        />
                    </QCardActions>
                </QCard>
            </QDialog>

            <QDialog
                :model-value="!!importCSVError"
                persistent
            >
                <QCard>
                    <QCardSection>
                        <p>{{ t('project.libraries.card.csv-import.errors.dialogTitle') }}:</p>
                        <div>
                            <ul v-if="typeof importCSVError?.[0] === 'string' && !('row' in importCSVError)">
                                <li
                                    v-for="(string, index) in importCSVError"
                                    :key="index"
                                >
                                    {{ string }}
                                </li>
                            </ul>
                            <ul v-else>
                                <li
                                    v-for="(row, index) in importCSVError as ImportCSVErrorObject[]"
                                    :key="index"
                                >
                                    <p>{{ t('common.row') }} {{ row.row }}:</p>
                                    <p
                                        v-for="(error, indexError) in row.errors"
                                        :key="indexError"
                                    >
                                        {{ t('common.on') }} <span class="bold">{{ error.loc.join(', ') }}</span
                                        >: {{ error.msg }}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </QCardSection>
                    <QCardActions align="right">
                        <AtomicButton
                            :label="t('common.continue')"
                            @click="onModalImportCollectionClose"
                        />
                    </QCardActions>
                </QCard>
            </QDialog>
        </template>

        <template v-else>
            <QCardSection
                v-if="!!collectionCount"
                flat
            >
                <QIcon
                    color="positive"
                    name="mdi-check-circle-outline"
                    size="sm"
                />
                <p>
                    {{ t('project.libraries.card.csv-import.present', { count: collectionCount }) }}
                </p>
            </QCardSection>

            <QCardSection
                v-else
                flat
            >
                <QIcon
                    name="mdi-close-circle"
                    size="sm"
                />
                <p>
                    {{ t('project.libraries.card.csv-import.missing') }}
                </p>
            </QCardSection>
        </template>
    </QCard>
</template>

<style lang="sass" scoped>
.csv-card
    display: flex
    flex-direction: column
    min-height: 8rem
    border: 2px dashed var(--color-neutral-300)
    border-radius: var(--border-radius)
    background-color: var(--color-neutral-50)
    cursor: pointer
    &.present
        border: 2px solid var(--color-green)
        cursor: default

    &.error
        border-color: var(--color-negative)
        color: var(--color-negative)

    .q-card__section
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        flex-grow: 1
        gap: 0.5rem

        &.csv-input
            color: var(--color-neutral-500)
            display: flex
            flex-direction: column
            align-items: center
            text-align: center

            &.error
                border-color: var(--color-negative)

    .section-before-action
        padding-bottom: 0


    .q-card__actions
        padding: 0 1rem 0 0

    input
        display: none

.bold
    font-weight: bold
</style>
