<script setup lang="ts">
import { useLibraryStore } from '@/stores/libraryStore.ts'
import { computed, onMounted, ref } from 'vue'
import { useLibraryTable } from '@/components/library/libraryTable/useLibraryTable.ts'
import { useI18n } from 'vue-i18n'

const { defaultColumns, columnsWithActions, loading, filter } = useLibraryTable()
const libraryStore = useLibraryStore()
const { t } = useI18n()

const accesActions = ref(false)
const hasAccessToActions = computed(() => {
    return accesActions.value ? defaultColumns : columnsWithActions
})

onMounted(async () => {
    loading.value = true
    await libraryStore.fetchLibraries()
    loading.value = false
})
</script>

<template>
    <QToggle v-model="accesActions" />
    <QTable
        binary-state-sort
        :columns="hasAccessToActions"
        :filter="filter"
        flat
        :loading="loading"
        row-key="name"
        :rows="libraryStore.libraries.results"
        :rows-per-page-options="[10, 15, 20, 30, 0]"
    >
        <template #top-right>
            <QInput
                v-model="filter"
                debounce="300"
                dense
                :placeholder="t('libraries.table.search')"
            />
        </template>
        <template #body="props">
            <QTr>
                <QTd
                    v-if="hasAccessToActions"
                    style="width: 1px"
                >
                    <QBtn icon="mdi-menu">
                        <QMenu>
                            <QList>
                                <QItem :clickable="true"> Edit </QItem>
                            </QList>
                        </QMenu>
                    </QBtn>
                </QTd>
                <QTd>
                    {{ props.row.name }}
                </QTd>
                <QTd>
                    {{ props.row.alias }}
                </QTd>
                <QTd>
                    {{ props.row.code }}
                </QTd>
            </QTr>
        </template>
    </QTable>
</template>
