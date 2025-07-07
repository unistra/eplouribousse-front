<script lang="ts" setup>
import AtomicIcon from './AtomicIcon.vue'

const model = defineModel<string | number | undefined>()

defineProps<{
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
    (e: 'clear'): void
}>()
</script>

<template>
    <QInput
        v-model="model"
        :autofocus
        :clearable
        color="grey-100"
        :data-testid
        :disable
        :hide-bottom-space
        :label="`${label}${required ? ' *' : ''}`"
        outlined
        rounded
        :type="type ?? 'text'"
        @clear="emit('clear')"
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
