<script lang="ts" setup>
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import type { RouterLinkProps } from 'vue-router'

defineProps<{
    name?: string
    icon?: string
    to?: RouterLinkProps['to']
    tooltip?: string
}>()

const emit = defineEmits(['click'])
</script>

<template>
    <QItem
        clickable
        dense
        :to
        @click="emit('click')"
    >
        <AtomicIcon
            :name="icon ?? ''"
            :tooltip="tooltip ? tooltip : undefined"
        />
        <QItemSection v-if="name"> {{ name }}</QItemSection>
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
</style>
