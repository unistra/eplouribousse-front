<script setup lang="ts">
defineProps<{
    label?: string
    icon?: string
    iconRight?: string
    noCaps?: boolean
    outline?: boolean
    flat?: boolean
    loading?: boolean
    disable?: boolean
    tooltip?: string
    color?: string
    to?: string
    type?: 'submit'
    dataTestid?: string
}>()
</script>

<template>
    <QBtn
        :data-testid
        :disable
        :flat="flat ? flat : !!color"
        :icon
        :iconRight
        :label
        :loading
        :noCaps
        :outline="outline ? outline : !color"
        rounded
        :style="color ? `background-color:var(--color-${color});color:var(--color-white)` : ''"
        :to="to ? { name: to } : ''"
        :type
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QBtn>
</template>
