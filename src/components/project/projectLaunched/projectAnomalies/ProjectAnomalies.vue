<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import type { Resource } from '#/project.ts'
import { inject, type Ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const { notify } = useComposableQuasar()
const dialogModal = inject<Ref<boolean>>('dialogModal')

const resetInstruction = async () => {
    try {
        const response = await axiosI.patch<Pick<Resource, 'id' | 'status' | 'instructionTurns'>>(
            `/resources/${resourceStore.id}/reset/`,
        )

        const oldStatus = resourceStore.status
        resourceStore.status = response.data.status
        resourceStore.instructionTurns = response.data.instructionTurns
        if (dialogModal) dialogModal.value = false
        await resourceStore.fetchResources(oldStatus)
    } catch {
        notify({
            type: 'negative',
            message: t('errors.unknownRetry'),
        })
    }
}
</script>

<template>
    <div class="anomalies">
        <ProjectSegmentTable />
        <div
            v-if="projectStore.userIsAdmin"
            class="btns"
        >
            <AtomicButton
                color="primary"
                :label="t('project.anomaly.tab.btnGiveTurn')"
                no-border
            />
            <AtomicButton
                color="primary"
                :label="t('project.anomaly.tab.btnReset')"
                no-border
                require-confirmation
                @confirm="resetInstruction"
            />
        </div>
    </div>
</template>

<style scoped lang="sass">
.anomalies
    display: flex
    flex-direction: column
    width: 100%
    gap: 2rem

    .btns
        display: flex
        gap: 1rem
        justify-content: end
        align-items: center
</style>
