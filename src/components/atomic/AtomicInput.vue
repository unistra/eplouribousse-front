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
        outlined
        rounded
        color="grey-100"
        :model-value="model"
        :type="type ?? 'text'"
        :label="`${label}${required ? ' *' : ''}`"
        :clearable
        :disable
        @update:model-value="emit('update:model', $event)"
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
        <template
            #prepend
            v-if="icon"
        >
            <AtomicIcon :name="icon" />
        </template>
    </QInput>
</template>
