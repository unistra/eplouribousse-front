<script lang="ts" setup>
import LoginForm from '@/components/forms/auth/loginForm/LoginForm.vue'
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
</script>

<template>
    <QPage
        class="container column content-center"
        padding
    >
        <LoginForm />
    </QPage>
</template>
