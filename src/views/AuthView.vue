<script lang="ts" setup>
import AuthResetPassword from '@/components/auth/resetPassword/AuthResetPassword.vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLogin from '@/components/auth/login/AuthLogin.vue'
import AuthChangePassword from '@/components/auth/changePassword/AuthChangePassword.vue'
import AuthRequestPasswordReset from '@/components/auth/requestPasswordReset/AuthRequestPasswordReset.vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { onMounted } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import AuthCreateAccount from '@/components/auth/createAccount/AuthCreateAccount.vue'

const route = useRoute()

onMounted(async () => {
    if (route.name !== 'handshake') return

    const token = route.query.t
    const router = useRouter()
    const { t } = useI18n()
    const globalStore = useGlobalStore()
    const userStore = useUserStore()

    try {
        const response = await axiosI.post<{ access: string; refresh: string }>('/users/login-handshake/', {
            t: token,
        })

        userStore.isAuth = true
        localStorage.setItem('JWT__access__token', response.data.access)
        localStorage.setItem('JWT__refresh__token', response.data.refresh)

        const profile = await axiosI.get('/users/profile/')
        localStorage.setItem('username', profile.data.username)

        await router.push({
            name: 'Home',
        })
    } catch (e) {
        globalStore.addNotify({
            type: 'negative',
            message: t('errors.unknown') + ', ' + t('errors.retry'),
        })
        await router.push({ name: 'Home' })
    }
})
</script>

<template>
    <QPage padding>
        <h1>{{ route.meta.title }}</h1>
        <AuthLogin v-if="route.name === 'login'" />
        <AuthChangePassword v-else-if="route.name === 'changePassword'" />
        <AuthResetPassword v-else-if="route.name === 'resetPassword'" />
        <AuthRequestPasswordReset v-else-if="route.name === 'requestPasswordReset'" />
        <AuthCreateAccount v-else-if="route.name === 'createAccount'" />
    </QPage>
</template>

<style scoped lang="sass">
main
    display: flex
    flex-direction: column
    gap: 1rem
    align-items: center
</style>
