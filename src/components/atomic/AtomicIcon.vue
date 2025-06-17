<script setup lang="ts">
defineProps<{
    name: string
    tooltip?: string
    color?: string
}>()
</script>

<template>
    <QIcon
        :style="`color: var(--${color ? color : 'color-neutral-400'})`"
        :name="name"
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QIcon>
</template>
