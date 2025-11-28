<script lang="ts" setup>
import AuthResetPassword from '@/components/auth/resetPassword/AuthResetPassword.vue'
import AuthLogin from '@/components/auth/login/AuthLogin.vue'
import AuthChangePassword from '@/components/auth/changePassword/AuthChangePassword.vue'
import AuthRequestPasswordReset from '@/components/auth/requestPasswordReset/AuthRequestPasswordReset.vue'
import AuthLogout from '@/components/auth/logout/AuthLogout.vue'
import AuthCreateAccount from '@/components/auth/createAccount/AuthCreateAccount.vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth.ts'

const route = useRoute()

onMounted(async () => {
    if (route.name === 'handshake') await useAuth().shibbolethHandshake()
})
</script>

<template>
    <QPage
        v-if="route.name !== 'handshake'"
        padding
    >
        <h1>{{ route.meta.title }}</h1>
        <AuthLogin v-if="route.name === 'login'" />
        <AuthLogout v-if="route.name === 'logout'" />
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
