<script setup lang="ts">
defineProps<{
    name: string
    tooltip?: string
    color?: string
}>()
</script>

<template>
    <QIcon
        :name="name"
        :style="`color: var(--${color ? color : 'color-neutral-400'})`"
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QIcon>
</template>
