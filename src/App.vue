<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore'
import LayoutDrawer from './components/layout/LayoutDrawer.vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const userStore = useUserStore()
const globalStore = useGlobalStore()

onMounted(async () => {
    globalStore.defineBackendBaseURL()
    await globalStore.fetchTenant()
    await userStore.fetchUser()
})
</script>

<template>
    <QLayout view="hHh lpR fFf">
        <LayoutDrawer />
        <QPageContainer>
            <RouterView />
        </QPageContainer>
    </QLayout>
</template>

<style scoped>
.q-page-container {
    overflow-y: auto;
    height: 100vh;
}
</style>
