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
        v-if="userStore.isAuth && userStore.isLocal"
        class="row"
    >
        <div class="col-4">
            <h4>{{ t('settings.account') }}</h4>
            <br />
            <ul>
                <li>
                    <RouterLink :to="{ name: 'changePassword' }">{{ t('settings.changePassword') }}</RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>
