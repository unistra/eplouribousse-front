<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useHeaderLinks } from '@/composables/useNavLinks'
import { useAuthentication } from '@/composables/useAuthentication'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const { t } = useI18n()
const { logout } = useAuthentication()
const navLinks = useHeaderLinks()
const router = useRouter()
const isAuth = computed(() => {
    return localStorage.getItem('username') !== null
})

async function onLogout() {
    logout()
    const { addNotify } = useGlobalStore()
    addNotify({
        message: t('logout.success'),
    })
    await router.push({ name: 'Home' })
}
</script>

<template>
    <QItem
        :key="index"
        :to="navLink.to"
        v-for="(navLink, index) in navLinks"
        clickable
        dense
        class="text-white"
    >
        <QItemSection>{{ t(`navigation.${navLink.label}`) }}</QItemSection>
    </QItem>
    <QItem
        v-if="isAuth"
        dense
        class="text-white"
        clickable
        @click="onLogout"
    >
        <QItemSection>{{ t('navigation.logout') }}</QItemSection>
    </QItem>
    <QItem
        v-else
        dense
        class="text-white"
        clickable
        to="/login"
    >
        <QItemSection>{{ t('navigation.login') }}</QItemSection>
    </QItem>
</template>
