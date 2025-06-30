<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
const { t } = useI18n()
const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
</script>

<template>
    <div class="container column items-center">
        <div class="container very-large row justify-center home-message">
            <p class="black very-large">{{ t('homeMessage') }}</p>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.home-message
    top: 50%
    position: absolute
</style>
