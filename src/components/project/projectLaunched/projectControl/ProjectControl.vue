<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { onMounted } from 'vue'

const { t } = useI18n()
const resourceStore = useResourceStore()

onMounted(async () => {
    await resourceStore.fetchAnomalies()
})
</script>

<template>
    <div class="control">
        <ProjectSegmentTable />
        <AtomicButton
            color="primary"
            :label="t('project.control.nextPhase')"
            no-border
        />
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
