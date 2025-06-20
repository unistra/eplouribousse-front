<script setup lang="ts">
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'

defineProps<{
    name?: string
    icon?: string
    to?: string
    tooltip?: string
}>()

const emit = defineEmits(['click'])
</script>

<template>
    <QItem
        :class="'item-content'"
        clickable
        dense
        :to="to ? { name: to } : ''"
        @click="emit('click')"
    >
        <AtomicIcon
            :name="icon ?? ''"
            :tooltip="tooltip ? tooltip : undefined"
        />
        <QItemSection v-if="name"> {{ name }} </QItemSection>
    </QItem>
</template>

<style lang="sass" scoped>
.item-content
    display: flex
    align-items: center
</style>
