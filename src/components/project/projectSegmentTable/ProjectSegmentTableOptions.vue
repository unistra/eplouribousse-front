<script setup lang="ts">
import ProjectInstructionSegmentDialog from '@/components/project/projectLaunched/projectInstruction/projectInstructionSegmentDialog/ProjectInstructionSegmentDialog.vue'
import AtomicConfirmationDialog from '@/components/atomic/AtomicConfirmationDialog.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useProjectSegmentTableOptions } from '@/components/project/projectSegmentTable/projectSegmentTableOptions/useProjectSegmentTableOptions.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'
import type { Segment } from '#/project.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Tab } from '&/project.ts'

const loading = defineModel<boolean>('loading', { required: true })

defineProps<{
    row: Segment
    openDialogCreateSegment: (insertAfterId: string | undefined) => void
}>()
const emit = defineEmits<{
    (e: 'addAnomaly'): void
}>()

const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const { t } = useI18n()

const {
    orderSegment,
    isSegmentCollectionLibrarySameAsLibrarySelected,
    dialogUpdateSegment,
    dialogDeleteSegment,
    userIsInstructorForSegmentCollectionLibrary,
} = useProjectSegmentTableOptions(loading)
</script>

<template>
    <div class="options">
        <div
            v-if="row.acl && row.acl.up && row.acl.down && isSegmentCollectionLibrarySameAsLibrarySelected(row)"
            class="order"
        >
            <AtomicButton
                :class="{ opacity: row.order === 1 }"
                icon="mdi-chevron-up"
                no-border
                size="sm"
                @click="orderSegment(row, 'up')"
            />
            <AtomicButton
                :class="{
                    opacity: row.order === resourceStore.segments.length || resourceStore.segments.length === 1,
                }"
                icon="mdi-chevron-down"
                no-border
                size="sm"
                @click="orderSegment(row, 'down')"
            />
        </div>
        <AtomicButton
            icon="mdi-dots-vertical"
            no-border
            size="sm"
        >
            <QMenu auto-close>
                <QList>
                    <QItem
                        v-if="row.acl && row.acl.partialUpdate && isSegmentCollectionLibrarySameAsLibrarySelected(row)"
                        clickable
                        @click="dialogUpdateSegment = true"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-pencil" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('common.update') }}</QItemLabel>
                        </QItemSection>
                        <ProjectInstructionSegmentDialog
                            v-model="dialogUpdateSegment"
                            :is-new="false"
                            :segment="row"
                        />
                    </QItem>
                    <QItem
                        v-if="row.acl && row.acl.destroy && isSegmentCollectionLibrarySameAsLibrarySelected(row)"
                        clickable
                        @click="dialogDeleteSegment = true"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-delete-forever" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('common.delete') }}</QItemLabel>
                        </QItemSection>
                        <AtomicConfirmationDialog
                            v-model="dialogDeleteSegment"
                            @confirm="resourceStore.deleteSegment(row.id)"
                        />
                    </QItem>
                    <QItem
                        v-if="projectStore.userIsInstructorForLibrarySelected"
                        clickable
                        @click="openDialogCreateSegment(row.id)"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-arrow-left-bottom" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('project.instruction.segment.insertUnder') }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                    <QItem
                        v-if="
                            (!userIsInstructorForSegmentCollectionLibrary(row) &&
                                (projectStore.tab === Tab.InstructionBound ||
                                    projectStore.tab === Tab.InstructionUnbound)) ||
                            (projectStore.userIsController && projectStore.tab === Tab.Control)
                        "
                        clickable
                        @click="emit('addAnomaly')"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-alert-circle" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ t('project.instruction.segment.signalAnomalie') }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                </QList>
            </QMenu>
        </AtomicButton>
    </div>
</template>

<style scoped lang="sass">
.options
        display: flex
        justify-content: end
        align-items: center
        .order
            display: flex
            .opacity
                opacity: 0
                cursor: default

            .q-btn
                width: fit-content
</style>
