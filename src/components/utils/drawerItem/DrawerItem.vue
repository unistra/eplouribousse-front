<script lang="ts" setup>
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import type { RouterLinkProps } from 'vue-router'

defineProps<{
    name?: string
    icon?: string
    to?: RouterLinkProps['to']
    tooltip?: string
    isAdministrated?: boolean
}>()

const emit = defineEmits(['click', 'administrate'])
</script>

<template>
    <div class="item">
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
        <AtomicButton
            v-if="isAdministrated"
            dense
            flat
            icon="mdi-cog"
            round
            @click="emit('administrate')"
        />
    </div>
</template>

<style lang="sass" scoped>
.q-item
    display: flex
    align-items: center
    justify-content: center
    gap: 0.5rem
    padding-bottom: 0.5rem
    padding-top: 0.5rem
.item
    display: flex
    flex-direction: row
    justify-content: space-between
</style>
