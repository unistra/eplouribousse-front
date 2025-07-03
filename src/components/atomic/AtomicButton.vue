<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router'

defineProps<{
    label?: string
    icon?: string
    iconRight?: string
    caps?: boolean
    noBorder?: boolean
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
        :color
        :data-testid
        :disable
        :icon
        :iconRight
        :label
        :loading
        :noCaps="!caps"
        :outline="!noBorder"
        rounded
        :size
        :to
        :type
        unelevated
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
    </QBtn>
</template>
