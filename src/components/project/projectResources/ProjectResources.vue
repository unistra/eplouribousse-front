<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectResources } from '@/components/project/projectResources/useProjectResources.ts'
import { useI18n } from 'vue-i18n'
import type { QTable } from 'quasar'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import ProjectPositioning from '@/components/project/projectResources/ProjectPositioning.vue'
import { useResourceStore } from '@/stores/resourceStore.ts'

const resourceStore = useResourceStore()

const {
    libraryIdSelected,
    librariesOptions,
    selectDefaultLibrary,
    table,
    onRowClick,
    resourceDialog,
    resourceIdSelected,
} = useProjectResources()
const { t } = useI18n()
onMounted(async () => {
    selectDefaultLibrary()
    await resourceStore.fetchResources(libraryIdSelected.value)
})
</script>

<template>
    <div class="project-resources">
        <QSelect
            v-model="libraryIdSelected"
            emit-value
            map-options
            option-label="name"
            option-value="id"
            :options="librariesOptions"
            @update:model-value="resourceStore.fetchResources"
        />
        <QTable
            ref="qTable"
            v-model:pagination="table.pagination"
            binary-state-sort
            :columns="table.columns as QTable['columns']"
            :filter="table.filter"
            flat
            :loading="table.loading.value"
            row-key="id"
            :rows="resourceStore.resources"
            @request="table.onRequest"
            @row-click="onRowClick"
        >
            <template #top-right>
                <QInput
                    v-model="table.filter.value"
                    debounce="300"
                    dense
                    :placeholder="t('common.search')"
                >
                    <template v-slot:append>
                        <QIcon name="mdi-magnify" />
                    </template>
                </QInput>
            </template>
        </QTable>
        <QDialog
            v-model="resourceDialog"
            full-height
            full-width
        >
            <QCard>
                <QCardActions>
                    <AtomicButton
                        icon="mdi-arrow-left"
                        no-border
                        @click="resourceDialog = false"
                    />
                </QCardActions>
                <QCardSection>
                    <ProjectPositioning
                        v-if="resourceIdSelected"
                        :library-id-selected="libraryIdSelected || ''"
                        :resource-id="resourceIdSelected"
                    />
                    <p v-else>{{ t('errors.unknown') }}</p>
                </QCardSection>
            </QCard>
        </QDialog>
    </div>
</template>

<style scoped lang="sass">
.project-resources
    display: flex
    flex-direction: column
    width: 100%

    .q-list
        width: 100%
</style>
