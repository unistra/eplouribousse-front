<script setup lang="ts">
defineProps<{
    name: string
    tooltip?: string
    color?: string
    iconRight?: boolean
}>()
</script>

<template>
    <QIcon
        :left="iconRight ? false : true"
        :name="name"
        :right="iconRight"
        size="1.7rem"
        :style="`color: var(--${color ? color : 'color-neutral-400'})`"
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QIcon>
</template>
