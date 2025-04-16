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
    loading?: boolean
}>()
</script>

<template>
    <QBtn
        :loading="loading"
        :label
        :icon
        :disable
        :flat
        :round
        :dense
        :outline
        :no-caps="!withCaps"
        :type
    >
        <slot />
    </QBtn>
</template>
