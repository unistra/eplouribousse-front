<script lang="ts" setup>
import { useLibraryStore } from '@/stores/libraryStore.ts'
import { computed, onMounted, ref } from 'vue'
import { useLibraryTable } from '@/components/library/libraryTable/useLibraryTable.ts'
import { useI18n } from 'vue-i18n'
import LibraryCreateAndEditBtn from '@/components/library/libraryCreateAndEditBtn/LibraryCreateAndEditBtn.vue'
import LibraryDeleteBtn from '@/components/library/libraryDeleteBtn/LibraryDeleteBtn.vue'
import type { Library, LibraryI } from '#/library.d.ts'

const props = defineProps<{
    withAddBtn?: boolean // Button to add library to a selection (e.g., on a project creation)
    librarySelected?: LibraryI['id'][] // Libraries that are already selected, that should not be listed in the table
}>()
const emit = defineEmits<{
    selected: Library[]
}>()

const { defaultColumns, columnsWithActions, columnsWithAddBtn, loading, filter, onRequest, pagination, tableRef } =
    useLibraryTable(props.librarySelected || [])
const libraryStore = useLibraryStore()
const { t } = useI18n()

const accessActions = ref(false)
const hasAccessToActionsOrAddBtn = computed(() => {
    // For dev purposes, to toggle the visibility of actions, should be replaced with real access control logic
    if (props.withAddBtn) return columnsWithAddBtn
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
        :columns="hasAccessToActionsOrAddBtn"
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
            <!-- Actions menu displayed only if 'menu' is present in 'column' attribute given to QTable -->
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
        <template #body-cell-addBtn="props">
            <!-- Add-Btn displayed only if 'addBtn' is present in 'columns' attribute given to QTable -->
            <QTd style="width: 1px">
                <QBtn
                    flat
                    icon="mdi-plus"
                    @click="emit('selected', props.row)"
                />
            </QTd>
        </template>
    </QTable>
</template>
