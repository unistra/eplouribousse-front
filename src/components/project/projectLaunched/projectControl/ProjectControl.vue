<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import AnomalyDeclarationBtn from '@/components/anomaly/AnomalyDeclarationBtn.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { inject, type Ref } from 'vue'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { ResourceStatus } from '&/project.ts'
import { useUtils } from '@/composables/useUtils.ts'

const dialogModal = inject<Ref<boolean>>('dialogModal')

const { t } = useI18n()
const { useHandleError } = useUtils()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()

const validateControl = async () => {
    const resourcesStore = useResourcesStore()
    try {
        await axiosI.post(`/resources/${resourceStore.resource?.id}/control/`, {
            validation: true,
        })
        await resourcesStore.getResources({ status: [resourceStore.resource?.status || ResourceStatus.Positioning] })
    } catch (e) {
        useHandleError(e)
    }
}

const onValidateControl = async () => {
    await validateControl()
    if (dialogModal) dialogModal.value = false
}
</script>

<template>
    <div class="control">
        <ProjectSegmentTable />
        <div
            v-if="projectStore.userIsController"
            class="buttons"
        >
            <AnomalyDeclarationBtn
                v-if="resourceStore.anomaliesUnfixed.length"
                @confirm="dialogModal = false"
            />
            <AtomicButton
                color="primary"
                :disable="!!resourceStore.anomaliesUnfixed.length"
                :label="t('views.project.control.nextPhase')"
                no-border
                @click="onValidateControl"
            >
                <QTooltip
                    v-if="!!resourceStore.anomaliesUnfixed.length"
                    :delay="1000"
                    >{{ t('views.project.anomaly.actionBtnDisabled', 2) }}</QTooltip
                >
            </AtomicButton>
        </div>
    </div>
</template>

<style scoped lang="sass">
.control
    display: flex
    flex-direction: column
    width: 100%
    gap: 2rem

    .buttons
        align-self: end
        display: flex
        gap: 1rem
</style>
