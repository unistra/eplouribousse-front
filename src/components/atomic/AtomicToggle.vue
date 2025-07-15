<script setup lang="ts">
const model = defineModel()

defineProps<{
    leftLabel?: boolean
    label?: string
}>()
</script>

<template>
    <QToggle
        v-model="model"
        color="primary"
        :label
        :left-label="leftLabel"
    />
</template>

<style scoped></style>
