<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import { onMounted } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useProjectInstruction } from '@/components/project/projectLaunched/projectInstruction/useProjectInstruction.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const { columns, orderedRows, orderSegment, tableLoading } = useProjectInstruction()

onMounted(async () => {
    tableLoading.value = true
    await resourceStore.fetchSegments()
    tableLoading.value = false
})
</script>

<template>
    <QTable
        :columns="columns"
        flat
        hide-pagination
        :loading="tableLoading"
        row-key="id"
        :rows="orderedRows"
    >
        <template #body-cell-reorder="{ row }">
            <div class="order">
                <AtomicButton
                    :class="{ opacity: row.order === 1 }"
                    icon="mdi-chevron-up"
                    no-border
                    size="sm"
                    @click="orderSegment(row, 'up')"
                />
                <AtomicButton
                    :class="{ opacity: row.order === resourceStore.segments.length }"
                    icon="mdi-chevron-down"
                    no-border
                    size="sm"
                    @click="orderSegment(row, 'down')"
                />
            </div>
        </template>
    </QTable>
    <AtomicButton
        class="btn-segment"
        :label="t('project.instruction.segment.new')"
    />
</template>

<style scoped lang="sass">
.spinner
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 1

.btn-segment
    width: fit-content

.q-table
    .order
        display: flex
        flex-direction: column
        align-items: end

        .opacity
            opacity: 0

        .q-btn
            width: fit-content
</style>
