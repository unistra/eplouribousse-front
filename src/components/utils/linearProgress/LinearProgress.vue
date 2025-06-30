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
        rounded
        size="5px"
        :value="progress"
    />
</template>
