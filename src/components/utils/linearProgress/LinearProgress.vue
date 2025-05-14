<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    passwordStrength: number
}>()

const color = ['red', 'red', 'red', 'light-green', 'green']
const progress = computed(() => props.passwordStrength * 0.25)
</script>

<template>
    <QLinearProgress
        size="5px"
        :color="color[passwordStrength]"
        :value="progress"
    />
</template>
