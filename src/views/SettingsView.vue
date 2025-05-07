<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
</script>

<template>
    <div class="container-center">
        <h1>{{ t('settings.core') }}</h1>
    </div>
    <div
        class="container-left"
        v-if="userStore.isAuth"
    >
        <h4>{{ t('settings.account') }}</h4>
    </div>
</template>
