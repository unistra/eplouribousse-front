<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router'
import AtomicConfirmationDialog from '@/components/atomic/AtomicConfirmationDialog.vue'
import { ref } from 'vue'

const props = defineProps<{
    label?: string
    icon?: string
    iconRight?: string
    caps?: boolean
    noBorder?: boolean
    round?: boolean
    loading?: boolean
    disable?: boolean
    tooltip?: string
    color?: string
    to?: RouterLinkProps['to']
    type?: 'submit'
    dataTestid?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    requireConfirmation?: boolean
    confirmButtonColor?: 'red' | 'green' | 'primary'
}>()

const modalConfirmation = ref<boolean>(false)

const onClick = () => {
    if (props.requireConfirmation) modalConfirmation.value = true
    else emit('click')
}

const emit = defineEmits<{
    (e: 'confirm'): void
    (e: 'cancel'): void
    (e: 'click'): void
}>()
</script>

<template>
    <QBtn
        :color
        :data-testid
        :disable
        :icon
        :iconRight
        :label
        :loading
        :noCaps="!caps"
        :outline="!noBorder"
        :round
        rounded
        :size
        :to
        :type
        unelevated
        @click="onClick"
    >
        <slot />
        <AtomicConfirmationDialog
            v-if="requireConfirmation"
            v-model="modalConfirmation"
            :confirm-button-color="confirmButtonColor"
            @cancel="emit('cancel')"
            @confirm="emit('confirm')"
        >
            <template #confirmation-content>
                <slot name="confirmation-content" />
            </template>
        </AtomicConfirmationDialog>
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QBtn>
</template>
