<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useHeaderLinks } from '@/composables/useNavLinks'
import { useAuthentication } from '@/composables/useAuthentication'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useUserStore } from '@/stores/userStore'
import type { NavLink } from '#/utils'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const { logout } = useAuthentication()
const navLinks = useHeaderLinks()
const router = useRouter()
const userStore = useUserStore()
const logoutURL = ref<string>('')

function hasPerm(navLink: NavLink) {
    return !navLink.require || (navLink.require && userStore.user.role && navLink.require.includes(userStore.user.role))
}

async function onLogout() {
    logout()
    const { addNotify } = useGlobalStore()
    addNotify({
        message: t('logout.success'),
    })
    await router.push({ name: 'Home' })
}

onMounted(() => {
    logoutURL.value = window.location.href.split('.app.unistra.fr')[0].concat('.app.unistra.fr/saml2/logout/')
})
</script>

<template>
    <QItem
        :key="index"
        :to="navLink.to"
        v-for="(navLink, index) in navLinks.filter(hasPerm)"
        clickable
        dense
        class="text-white"
    >
        <QItemSection>{{ t(`navigation.${navLink.label}`) }}</QItemSection>
    </QItem>
    <QItem
        v-if="userStore.isAuth"
        dense
        class="text-white"
        clickable
        @click="onLogout"
    >
        <QItemSection>{{ t('navigation.logout') }}</QItemSection>
    </QItem>
    <QItem
        v-else-if="userStore.isLocal"
        dense
        class="text-white"
        clickable
        to="/login"
    >
        <QItemSection>{{ t('navigation.login') }}</QItemSection>
    </QItem>
    <QItem
        v-else
        dense
        class="text-white"
        clickable
        :href="logoutURL"
    >
        <QItemSection>{{ t('navigation.login') }}</QItemSection>
    </QItem>
</template>
