<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Anomaly } from '#/project.ts'
import { ResourceStatus } from '&/project.ts'
import { useUtils } from '@/composables/useUtils.ts'

const emit = defineEmits(['confirm'])

const { t } = useI18n()
const { useHandleError } = useUtils()
const resourceStore = useResourceStore()

const declareAnomaly = async () => {
    const resourcesStore = useResourcesStore()
    try {
        await axiosI.patch<Anomaly>(`/resources/${resourceStore.resource?.id}/report-anomalies/`)
        await resourcesStore.getResources({ status: [resourceStore.resource?.status || ResourceStatus.Positioning] })
    } catch (e) {
        useHandleError(e)
    }
}

const onConfirm = async () => {
    await declareAnomaly()
    emit('confirm')
}
</script>

<template>
    <AtomicButton
        color="primary"
        confirm-button-color="primary"
        icon="mdi-alert-circle"
        :label="t('project.anomaly.declareBtn', 2)"
        no-border
        requireConfirmation
        @confirm="onConfirm"
    />
</template>
