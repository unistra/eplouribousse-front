<script lang="ts" setup>
import type { SelectOption } from '#/utils'

defineProps<{
    label?: string
    disable?: boolean
    model?: string | number | undefined
    options?: SelectOption[]
}>()

const emit = defineEmits<{
    (e: 'update:model', value: string | number): void
}>()
</script>

<template>
    <QSelect
        :label
        :disable
        :options="options"
        :model-value="model"
        emit-value
        map-options
        @update:model-value="emit('update:model', $event)"
    />
</template>
