<script setup lang="ts">
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
        :inset-level
        :disable
        :dense
        @click="clickable ?? router.push({ name: to ? to : '' })"
        ><slot
    /></QItem>
</template>
