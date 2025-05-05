<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
    passwordStrength: number
}>()

const color = ['red', 'red', 'red', 'orange', 'green']
const progress = computed(() => {
    return props.passwordStrength * 0.25
})
</script>

<template>
    <div :class="passwordStrength < 3 ? 'with-message' : ''">
        <QLinearProgress
            size="5px"
            :color="color[passwordStrength]"
            :value="progress"
        />
    </div>
</template>

<style scoped>
.with-message {
    display: flex;
    align-items: center;
    padding-top: 1.5rem;
}
</style>
