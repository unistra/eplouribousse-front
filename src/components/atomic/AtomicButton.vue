<script setup lang="ts">
import AtomicIcon from './AtomicIcon.vue'

defineProps<{
    label?: string
    icon?: string
    noCaps?: boolean
    outline?: boolean
    flat?: boolean
    disable?: boolean
    tooltip?: string
    color?: string
}>()
</script>

<template>
    <QBtn
        :label
        :noCaps
        :disable
        :outline="color ? false : true"
        :flat="color ? true : false"
        :style="color ? `background-color:${color};color:var(--color-white)` : ''"
        rounded
    >
        <QTooltip v-if="tooltip">{{ tooltip }}</QTooltip>
        <AtomicIcon
            v-if="icon"
            :color="color ? 'color-white' : ''"
            :name="icon"
        />
    </QBtn>
</template>
