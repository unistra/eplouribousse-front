<script setup lang="ts">
import type { QSelectProps } from 'quasar'

const model = defineModel()

defineProps<{
    label?: string
    options: QSelectProps['options']
    optionValue?: QSelectProps['optionValue']
    optionLabel?: QSelectProps['optionLabel']
    emitValue?: boolean
    mapOptions?: boolean
    rules?: QSelectProps['rules']
    dense?: boolean
}>()
</script>

<template>
    <QSelect
        v-model="model"
        color="grey-100"
        :dense
        :emit-value
        :label
        :map-options
        :option-label
        :option-value
        :options
        outlined
        rounded
        :rules
    />
</template>
