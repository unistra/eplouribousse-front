<script setup lang="ts">
import AtomicIcon from './AtomicIcon.vue'

defineProps<{
    model: string | number | undefined
    autofocus?: boolean
    hideBottomSpace?: boolean
    type?: 'text' | 'textarea' | 'email' | 'search' | 'number' | 'url' | 'password'
    label?: string
    clearable?: boolean
    counter?: boolean
    disable?: boolean
    required?: boolean
    icon?: string
    tooltip?: string
    dataTestid?: string
}>()

const emit = defineEmits<{
    (_e: 'update:model', _value: string | number | null): void
    (_e: 'clear'): void
}>()
</script>

<template>
    <QInput
        :autofocus
        :clearable
        color="grey-100"
        :data-testid
        :disable
        :hide-bottom-space
        :label="`${label}${required ? ' *' : ''}`"
        :model-value="model"
        outlined
        rounded
        :type="type ?? 'text'"
        @clear="emit('clear')"
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
