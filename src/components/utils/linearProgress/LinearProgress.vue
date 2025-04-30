<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    passwordStrength: number
}>()

const progress = computed(() => {
    return props.passwordStrength * 0.25
})
</script>

<template>
    <div class="container-align">
        <QLinearProgress
            size="25px"
            color="primary"
            :value="progress"
        />
        <QIcon
            size="2rem"
            :name="passwordStrength < 3 ? 'mdi-close' : 'mdi-check'"
            :color="passwordStrength < 3 ? 'red' : 'green'"
        />
    </div>
</template>

<style scoped>
.container-align {
    display: flex;
    align-items: center;
}
</style>
