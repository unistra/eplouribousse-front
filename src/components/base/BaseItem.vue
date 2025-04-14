<script lang="ts" setup>
import router from '@/router'

defineProps<{
    clickable?: boolean
    to?: string
    insetLevel?: number
    disable?: boolean
    dense?: boolean
}>()
</script>

<template>
    <QItem
        :clickable
        :dense
        :disable
        :inset-level
        @click="clickable ?? router.push({ name: to ?? 'Home' })"
    >
        <slot />
    </QItem>
</template>
