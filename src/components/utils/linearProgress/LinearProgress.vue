<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
        >
            <div class="absolute-full flex flex-center">
                <QBadge
                    color="white"
                    text-color="black"
                    :label="t('forms.password.passwordStrength')"
                />
            </div>
        </QLinearProgress>
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
