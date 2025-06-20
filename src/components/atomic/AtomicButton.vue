<script setup lang="ts">
defineProps<{
    label?: string
    icon?: string
    iconRight?: string
    noCaps?: boolean
    outline?: boolean
    flat?: boolean
    disable?: boolean
    tooltip?: string
    color?: string
    to?: string
}>()
</script>

<template>
    <QBtn
        :disable
        :flat="!!color"
        :icon
        :iconRight
        :label
        :noCaps
        :outline="!color"
        rounded
        :style="color ? `background-color:var(--color-${color});color:var(--color-white)` : ''"
        :to="to ? { name: to } : ''"
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QBtn>
</template>
