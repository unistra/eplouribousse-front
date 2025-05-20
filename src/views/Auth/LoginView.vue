<script setup lang="ts">
import LoginForm from '@/components/forms/loginForm/LoginForm.vue'
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
</script>

<template>
    <!-- - Select with different CAS (if none, do not display) -->
    <!-- - Renater -->
    <!-- - Login form -->
    <main class="container-center">
        <LoginForm />
    </main>
</template>
