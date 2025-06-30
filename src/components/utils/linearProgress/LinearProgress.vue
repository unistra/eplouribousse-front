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
        :color="color[passwordStrength]"
        :value="progress"
        size="5px"
        rounded
    />
</template>
