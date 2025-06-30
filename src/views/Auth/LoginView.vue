<script setup lang="ts">
import LoginForm from '@/components/forms/auth/loginForm/LoginForm.vue'
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
</script>

<template>
    <div class="container column content-center">
        <LoginForm />
    </div>
</template>
