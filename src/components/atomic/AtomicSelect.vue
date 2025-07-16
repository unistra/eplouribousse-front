<script setup lang="ts">
const model = defineModel()

defineProps<{
    label?: string
    options: unknown[]
}>()
</script>

<template>
    <QSelect
        v-model="model"
        :label
        :options
        outlined
    />
</template>
