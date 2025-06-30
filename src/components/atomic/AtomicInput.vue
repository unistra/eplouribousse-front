<script setup lang="ts">
import AtomicIcon from './AtomicIcon.vue'

defineProps<{
    model: string | number | undefined
    autofocus?: boolean
    hideBottomSpace?: boolean
    type?: 'text' | 'textarea' | 'email' | 'search' | 'number' | 'url' | 'password'
    label?: string
    clearable?: boolean
    disable?: boolean
    required?: boolean
    icon?: string
    tooltip?: string
}>()

const emit = defineEmits<{
    (_e: 'update:model', _value: string | number | null): void
}>()
</script>

<template>
    <QInput
        :clearable
        :autofocus
        :hide-bottom-space
        :disable
        :label="`${label}${required ? ' *' : ''}`"
        :model-value="model"
        :type="type ?? 'text'"
        color="grey-100"
        outlined
        rounded
        @update:model-value="emit('update:model', $event)"
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
        <template
            v-if="icon"
            #prepend
        >
            <AtomicIcon :name="icon" />
        </template>
    </QInput>
</template>
