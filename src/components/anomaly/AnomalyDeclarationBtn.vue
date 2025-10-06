<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'

const { t } = useI18n()
const resourceStore = useResourceStore()
const emit = defineEmits(['confirm'])

const onConfirm = async () => {
    await resourceStore.declareAnomaly()
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
