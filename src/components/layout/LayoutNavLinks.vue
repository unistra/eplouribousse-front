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
    logoutURL.value = location.href.split('-pprd.app.unistra.fr')[0].concat('-api-pprd.app.unistra.fr/saml2/logout/')
})
</script>

<template>
    <QItem
        v-for="(navLink, index) in navLinks.filter(hasPerm)"
        :key="index"
        class="text-white"
        clickable
        dense
        :to="navLink.to"
    >
        <QItemSection>{{ t(`navigation.${navLink.label}`) }}</QItemSection>
    </QItem>
    <QItem
        v-if="userStore.isAuth && userStore.isLocal"
        class="text-white"
        clickable
        dense
        @click="onLogout"
    >
        <QItemSection>{{ t('navigation.logout') }}</QItemSection>
    </QItem>
    <QItem
        v-else-if="userStore.isAuth && !userStore.isLocal"
        class="text-white"
        clickable
        dense
        :href="logoutURL"
        @click="onLogout"
    >
        <QItemSection>{{ t('navigation.logout') }}</QItemSection>
    </QItem>
    <QItem
        v-else
        class="text-white"
        clickable
        dense
        to="/login"
    >
        <QItemSection>{{ t('navigation.login') }}</QItemSection>
    </QItem>
</template>
