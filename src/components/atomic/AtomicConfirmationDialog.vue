<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import type { ButtonColor } from '#/utils.ts'

const { t } = useI18n()

defineProps<{
    confirmButtonColor?: ButtonColor
}>()
const modal = defineModel<boolean>()
const emit = defineEmits<{
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()

const closeModal = (event: 'confirm' | 'cancel') => {
    const fn = event === 'confirm' ? () => emit('confirm') : () => emit('cancel') // For typescript 🙃
    fn()
    modal.value = false
}
</script>

<template>
    <QDialog v-model="modal">
        <QCard>
            <slot name="confirmation-content">
                <QCardSection>
                    <p>{{ t('views.confirmDialogDefault.irreversible') }}</p>
                    <p>{{ t('views.confirmDialogDefault.areYouSure') }}</p>
                </QCardSection>
            </slot>
            <QCardActions align="right">
                <AtomicButton
                    :label="t('common.cancel')"
                    @click="closeModal('cancel')"
                />
                <AtomicButton
                    :color="confirmButtonColor || 'primary'"
                    :label="t('common.confirm')"
                    :no-border="!!confirmButtonColor"
                    @click="closeModal('confirm')"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
