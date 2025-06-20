<script setup lang="ts">
import AtomicIcon from './AtomicIcon.vue'

defineProps<{
    model: string | number | undefined
    type?: 'text' | 'textarea' | 'email' | 'search' | 'number' | 'url'
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
        color="grey-100"
        :disable
        :label="`${label}${required ? ' *' : ''}`"
        :model-value="model"
        outlined
        rounded
        :type="type ?? 'text'"
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
