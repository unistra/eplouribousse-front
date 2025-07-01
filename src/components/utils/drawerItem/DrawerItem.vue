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
        :class="'item-content'"
        clickable
        dense
        :to
        @click="emit('click')"
    >
        <AtomicIcon
            class="icon"
            :name="icon ?? ''"
            :tooltip="tooltip ? tooltip : undefined"
        />
        <QItemSection v-if="name"> {{ name }}</QItemSection>
    </QItem>
</template>

<style lang="sass" scoped>
.item-content
    display: flex
    align-items: center
</style>
