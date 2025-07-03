<script lang="ts" setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNewProjectLibraryCollection } from '@/components/newProject/steps/newProjectLibraries/collections/useNewProjectLibraryCollection.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import type { ImportCSVErrorObject } from '#/project'

const props = defineProps<{
    libraryId: string
    projectId: string
}>()

const { t } = useI18n()
const store = useProjectStore()
const {
    getCollection,
    collection,
    modalDeleteCollection,
    modalImportCSVResponse,
    importCSVResponse,
    modalImportCSVError,
    importCSVError,
    fileInput,
    onDrop,
    onFileChange,
    onModalImportCollectionClose,
    isCollectionLoading,
} = useNewProjectLibraryCollection(props.libraryId)

onMounted(async () => await getCollection())
</script>

<template>
    <p>{{ t('newProject.steps.libraries.collection.title') }}</p>
    <QCard
        v-if="isCollectionLoading"
        class="container justify-center items-center csv-card"
        flat
    >
        <QSpinner size="2rem" />
    </QCard>
    <QCard
        v-else-if="!collection || collection.results.length === 0"
        class="container column csv-card dropzone"
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
        class="container column csv-card present"
        flat
    >
        <QCardActions align="right">
            <QBtn
                color="dark"
                flat
                icon="mdi-close"
                size="xs"
                @click="modalDeleteCollection = true"
            />
            <QDialog v-model="modalDeleteCollection">
                <QCard>
                    <QCardSection>
                        <p>{{ t('newProject.steps.libraries.collection.delete.warning') }}</p>
                        <p>{{ t('newProject.steps.libraries.collection.delete.irreversible') }}</p>
                    </QCardSection>
                    <QCardActions align="right">
                        <QBtn
                            color="primary"
                            flat
                            label="Cancel"
                            @click="modalDeleteCollection = false"
                        />
                        <QBtn
                            color="negative"
                            flat
                            label="Delete"
                            @click="store.deleteCollection(libraryId)"
                        />
                    </QCardActions>
                </QCard>
            </QDialog>
        </QCardActions>
        <QCardSection class="content">
            <QIcon
                color="positive"
                name="mdi-check-circle-outline"
                size="sm"
            />
            <p>{{ t('newProject.steps.libraries.collection.present') }}</p>
        </QCardSection>
    </QCard>

    <QDialog
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
        v-model="modalImportCSVError"
        persistent
    >
        <QCard class="container column card">
            <QCardSection>
                <p>{{ t('newProject.steps.libraries.collection.errors.dialogTitle') }}:</p>
            </QCardSection>
            <QCardSection v-if="typeof importCSVError?.[0] === 'string' && !('row' in importCSVError)">
                <ul>
                    <li
                        v-for="(string, index) in importCSVError"
                        :key="index"
                    >
                        {{ string }}
                    </li>
                </ul>
            </QCardSection>
            <QCardSection v-else>
                <ul>
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

<style lang="scss" scoped>
.csv-card {
    min-height: 8rem;
    border: 2px dashed var(--color-neutral-300);
    border-radius: 2rem;
    text-align: center;
    background-color: var(--color-neutral-50);
    padding: 0.1rem;

    p {
        margin: 0;
    }

    &.dropzone {
        cursor: pointer;

        input {
            display: none;
        }
    }

    .present {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-color: var(--color-green);
    }
}

.bold {
    font-weight: 700;
}
</style>
