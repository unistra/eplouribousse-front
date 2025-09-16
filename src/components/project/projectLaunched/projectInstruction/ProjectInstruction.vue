<script setup lang="ts">
import { useResourceStore } from '@/stores/resourceStore.ts'
import { onMounted } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useProjectInstruction } from '@/components/project/projectLaunched/projectInstruction/useProjectInstruction.ts'
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'

const { t } = useI18n()
const resourceStore = useResourceStore()
const { columns, orderedRows, orderSegment, deleteSegment, tableLoading, dialogUpdateSegment, dialogCreateSegment } =
    useProjectInstruction()

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
        <template #body-cell-options="{ row }">
            <QTd class="options">
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
                    <AtomicButton
                        icon="mdi-delete-forever"
                        no-border
                        size="sm"
                        @click="deleteSegment(row)"
                    />
                </div>
                <AtomicButton
                    icon="mdi-dots-vertical"
                    no-border
                    size="sm"
                >
                    <QMenu>
                        <QList>
                            <QItem
                                clickable
                                @click="dialogUpdateSegment = true"
                                >{{ t('common.update') }}</QItem
                            >
                            <ProjectInstructionSegmentDialog
                                v-model="dialogUpdateSegment"
                                :segment="row"
                            />
                            <QItem>{{ t('common.delete') }}</QItem>
                            <QItem>{{ t('project.instruction.segment.insertUnder') }}</QItem>
                        </QList>
                    </QMenu>
                </AtomicButton>
                <div>
                    {{ row.acl }}
                </div>
            </QTd>
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
    .options
        display: flex
        height: fit-content
        justify-content: end


        .order
            display: flex
            flex-direction: column
            align-items: end

            .opacity
                opacity: 0

            .q-btn
                width: fit-content
</style>
