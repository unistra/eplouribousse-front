<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router'

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
    to?: RouterLinkProps['to']
    type?: 'submit'
    dataTestid?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    noBorder?: boolean
}>()
</script>

<template>
    <QBtn
        :class="{ 'border-0': noBorder }"
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
        :size
        :style="color ? `background-color:var(--color-${color});color:var(--color-white)` : ''"
        :to
        :type
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QBtn>
</template>
