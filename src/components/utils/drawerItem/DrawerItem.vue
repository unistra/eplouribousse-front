<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router'

defineProps<{
    name?: string
    icon: string
    to?: RouterLinkProps['to']
    tooltip?: string
}>()
</script>

<template>
    <QItem
        clickable
        dense
        :to
    >
        <QIcon :name="icon" />
        <QItemSection v-if="name"> {{ name }}</QItemSection>
        <slot />
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QItem>
</template>

<style lang="sass" scoped>
.q-item
    display: flex
    align-items: center
    justify-content: center
    gap: 0.5rem
    padding-bottom: 0.5rem
    padding-top: 0.5rem

    .q-icon
        color: var(--color-neutral-400)
        font-size: var(--font-size-2xl)
</style>
