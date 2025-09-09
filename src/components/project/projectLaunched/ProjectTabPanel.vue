<script setup lang="ts">
import { useProjectResources } from '@/components/project/projectLaunched/useProjectResources.ts'
import { useResourceStore } from '@/stores/resourceStore'
import { ResourceStatus } from '#/project.ts'
import type { QTable } from 'quasar'
import { useI18n } from 'vue-i18n'

defineProps<{
    tabName: string
}>()

const resourceStore = useResourceStore()
const emit = defineEmits(['onRowClick'])
const { table, resourceDialog, resourceIdSelected } = useProjectResources()
const { t } = useI18n()
</script>

<template>
    <QTabPanel :name="tabName">
        <QTable
            ref="qTable"
            v-model:pagination="table.pagination.value"
            binary-state-sort
            :columns="table.columns as QTable['columns']"
            :filter="table.filter"
            flat
            :loading="table.loading.value"
            row-key="id"
            :rows="resourceStore.getAll(table)"
            :rows-per-page-options="[5, 10, 20, 50, 100]"
            @request="table.onRequest"
            @row-click="emit('onRowClick')"
        >
            <template #top-right>
                <QInput
                    v-model="table.filter.value"
                    debounce="3000"
                    dense
                    :placeholder="t('common.search')"
                >
                    <template v-slot:append>
                        <QIcon name="mdi-magnify" />
                    </template>
                </QInput>
            </template>

            <template v-slot:body-cell-title="props">
                <QTd
                    :auto-width="false"
                    class="title-qtd"
                    :props="props"
                >
                    <p class="title-p">
                        {{ props.row.title }}
                    </p>
                </QTd>
            </template>
        </QTable>
        <QDialog
            v-model="resourceDialog"
            class="dialog"
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
                        v-if="resourceStore.status === ResourceStatus.Positioning"
                        :resource-id="resourceIdSelected"
                    />
                    <ProjectInstruction
                        v-else-if="resourceIdSelected"
                        :resource-id="resourceIdSelected"
                    />
                    <p v-else>{{ t('errors.unknown') }}</p>
                </QCardSection>
            </QCard>
        </QDialog>
    </QTabPanel>
</template>

<style lang="sass" scoped></style>
