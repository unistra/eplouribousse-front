<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useHeaderLinks } from '@/composables/useNavLinks'
import { useUserStore } from '@/stores/userStore'
import { useAuthentication } from '@/composables/useAuthentication'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const { logout } = useAuthentication()
const userStore = useUserStore()
const navLinks = useHeaderLinks()
const router = useRouter()
const { isAuth } = storeToRefs(userStore)

async function onLogout() {
    logout()
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
