<script lang="ts" setup>
defineProps<{
    label?: string
    icon?: string
    disable?: boolean
    flat?: boolean
    round?: boolean
    dense?: boolean
    outline?: boolean
    noCaps?: boolean
}>()
</script>

<template>
    <QBtn
        :label
        :icon
        :disable
        :flat
        :round
        :dense
        :outline
        :no-caps
    >
        <slot />
    </QBtn>
</template>
