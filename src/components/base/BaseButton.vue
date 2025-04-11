<script lang="ts" setup>
defineProps<{
    label?: string
    icon?: string
    disable?: boolean
    flat?: boolean
    round?: boolean
    dense?: boolean
    outline?: boolean
    withCaps?: boolean
    type?: string
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
        :no-caps="withCaps ? false : true"
        :type
    >
        <slot />
    </QBtn>
</template>
