<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
</script>

<template>
    <div class="control">
        <ProjectSegmentTable />
        <AtomicButton
            color="primary"
            :disable="!!resourceStore.anomalies.length"
            :label="t('project.control.nextPhase')"
            no-border
        >
            <QTooltip>{{ t('project.control.btnDisabled', 2) }}</QTooltip>
        </AtomicButton>
    </div>
</template>

<style scoped lang="sass">
.control
    display: flex
    flex-direction: column
    width: 100%

    > :first-child
        flex-grow: 1

    .q-btn
        width: fit-content
        align-self: end
</style>
