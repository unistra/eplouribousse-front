<script setup lang="ts">
import { useLibraryStore } from '@/stores/libraryStore.ts'
import { computed, onMounted, ref } from 'vue'
import { useLibraryTable } from '@/components/library/libraryTable/useLibraryTable.ts'
import { useI18n } from 'vue-i18n'
import LibraryCreateAndEditBtn from '@/components/library/libraryCreateAndEditBtn/LibraryCreateAndEditBtn.vue'
import LibraryDeleteBtn from '@/components/library/libraryDeleteBtn/LibraryDeleteBtn.vue'

const { defaultColumns, columnsWithActions, loading, filter, onRequest, pagination, tableRef } = useLibraryTable()
const libraryStore = useLibraryStore()
const { t } = useI18n()

const accessActions = ref(false)
const hasAccessToActions = computed(() => {
    return accessActions.value ? defaultColumns : columnsWithActions
})

onMounted(async () => {
    loading.value = true
    tableRef.value?.requestServerInteraction()
    loading.value = false
})
</script>

<template>
    <LibraryCreateAndEditBtn @submitted="tableRef?.requestServerInteraction" />
    <QToggle v-model="accessActions" />
    <QTable
        ref="qTable"
        v-model:pagination="pagination"
        binary-state-sort
        :columns="hasAccessToActions"
        :filter="filter"
        flat
        :loading="loading"
        row-key="id"
        :rows="libraryStore.libraries.results"
        @request="onRequest"
    >
        <template #top-right>
            <QInput
                v-model="filter"
                debounce="300"
                dense
                :placeholder="t('libraries.table.search')"
            >
                <template v-slot:append>
                    <QIcon name="mdi-magnify" />
                </template>
            </QInput>
        </template>
        <template #body-cell-menu="props">
            <QTd style="width: 1px">
                <QBtn
                    flat
                    icon="mdi-menu"
                >
                    <QMenu>
                        <QList>
                            <LibraryCreateAndEditBtn
                                :libraryToEdit="props.row"
                                @submitted="tableRef?.requestServerInteraction"
                            >
                                <template #button="{ openDialog }">
                                    <QItem
                                        :clickable="true"
                                        @click="openDialog"
                                    >
                                        <QItemSection avatar>
                                            <QIcon name="mdi-pencil" />
                                        </QItemSection>
                                        <QItemSection>
                                            {{ t('libraries.form.edit') }}
                                        </QItemSection>
                                    </QItem>
                                </template>
                            </LibraryCreateAndEditBtn>
                            <LibraryDeleteBtn
                                :libraryToDelete="props.row"
                                @submitted="tableRef?.requestServerInteraction"
                            >
                                <template #button="{ openDialog }">
                                    <QItem
                                        :clickable="true"
                                        @click="openDialog"
                                    >
                                        <QItemSection avatar>
                                            <QIcon name="mdi-delete" />
                                        </QItemSection>
                                        <QItemSection>
                                            {{ t('libraries.form.delete.i') }}
                                        </QItemSection>
                                    </QItem>
                                </template>
                            </LibraryDeleteBtn>
                        </QList>
                    </QMenu>
                </QBtn>
            </QTd>
        </template>
    </QTable>
</template>
