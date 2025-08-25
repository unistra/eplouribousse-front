<script lang="ts" setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/projectStore.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import type { ImportCSVErrorObject } from '#/project.ts'
import { useProjectLibraryCollection } from '@/components/project/projectStepper/steps/projectLibraries/collections/useProjectLibraryCollection.ts'

const props = defineProps<{
    libraryId: string
    projectId: string
    isSummary?: boolean
}>()

const { t } = useI18n()
const store = useProjectStore()
const {
    getCollection,
    collection,
    modalImportCSVResponse,
    importCSVResponse,
    modalImportCSVError,
    importCSVError,
    fileInput,
    onDrop,
    onFileChange,
    onModalImportCollectionClose,
    isCollectionLoading,
} = useProjectLibraryCollection(props.libraryId)

onMounted(async () => await getCollection())
</script>

<template>
    <p>{{ t('newProject.steps.libraries.collection.title') }}</p>
    <QCard
        v-if="isCollectionLoading"
        class="csv-card"
        flat
    >
        <QSpinner size="2rem" />
    </QCard>
    <template v-else-if="!isSummary">
        <QCard
            v-if="!collection?.results?.length"
            class="csv-card dropzone"
            flat
            @click="fileInput?.click()"
            @dragover.prevent
            @drop="onDrop"
        >
            <input
                ref="fileInput"
                accept=".csv,text/csv"
                type="file"
                @change="onFileChange"
            />
            <span>{{ t('newProject.steps.libraries.collection.dragAndDrop') }}</span>
        </QCard>
        <QCard
            v-else
            class="csv-card present"
            flat
        >
            <AtomicButton
                confirm-button-color="red"
                icon="mdi-close"
                no-border
                require-confirmation
                size="xs"
                @confirm="store.deleteCollection(libraryId)"
            />
            <QCardSection>
                <QIcon
                    color="positive"
                    name="mdi-check-circle-outline"
                    size="sm"
                />
                <p>
                    {{ t('newProject.steps.libraries.collection.present', { count: collection?.count }) }}
                </p>
            </QCardSection>
        </QCard>

        <QDialog
            v-if="!isSummary"
            v-model="modalImportCSVResponse"
            persistent
        >
            <QCard>
                <QCardSection>
                    <p>{{ t('newProject.steps.libraries.collection.importSuccess') }}</p>
                    <p>{{ t('newProject.steps.libraries.collection.weFound') }}:</p>
                </QCardSection>
                <QCardSection>
                    <ul>
                        <li
                            v-for="(count, key) in importCSVResponse"
                            :key="key"
                        >
                            {{
                                t('newProject.steps.libraries.collection.elementPresent', {
                                    count,
                                })
                            }}
                            {{ key }} {{ t('newProject.steps.libraries.collection.times') }}
                        </li>
                    </ul>
                </QCardSection>

                <QCardActions align="right">
                    <AtomicButton
                        :label="t('common.continue')"
                        @click="onModalImportCollectionClose"
                    />
                </QCardActions>
            </QCard>
        </QDialog>

        <QDialog
            v-if="!isSummary"
            v-model="modalImportCSVError"
            persistent
        >
            <QCard>
                <QCardSection class="errors-dialog">
                    <p>{{ t('newProject.steps.libraries.collection.errors.dialogTitle') }}:</p>
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
        <QCard
            v-if="!!collection?.results?.length"
            class="csv-card present summary"
            flat
        >
            <QCardSection>
                <QIcon
                    color="positive"
                    name="mdi-check-circle-outline"
                    size="sm"
                />
                <p>
                    {{ t('newProject.steps.libraries.collection.present', { count: collection?.count }) }}
                </p>
            </QCardSection>
        </QCard>

        <QCard
            v-else
            class="csv-card missing summary"
            flat
        >
            <QCardSection>
                <QIcon
                    name="mdi-close-circle"
                    size="sm"
                />
                <p>
                    {{ t('newProject.steps.libraries.collection.missing') }}
                </p>
            </QCardSection>
        </QCard>
    </template>
</template>

<style lang="sass" scoped>
.csv-card
    min-height: 8rem
    border: 2px dashed var(--color-neutral-300)
    border-radius: 2rem
    text-align: center
    background-color: var(--color-neutral-50)
    padding: 0.1rem

    p
        margin: 0

    &.dropzone
        cursor: pointer

        input
            display: none

    &.present
        border-style: solid
        border-color: var(--color-green)
        position: relative

        .q-btn
            position: absolute
            top: 0.5rem
            right: 0.5rem

    &.missing
        border-style: solid
        border-color: var(--color-neutral-500)

    &.summary
        min-height: 0

.bold
    font-weight: bold
</style>
