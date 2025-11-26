<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore'
import LayoutDrawer from './components/layout/LayoutDrawer.vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'
import { checkManuallyIsUserAuth } from '@/utils/auth.ts'

const userStore = useUserStore()
const globalStore = useGlobalStore()

onMounted(async () => {
    await globalStore.fetchTenant()
    if (checkManuallyIsUserAuth()) await userStore.getUser()
})
</script>

<template>
    <QLayout view="hHh lpR fFf">
        <LayoutHeader />
        <LayoutDrawer />
        <LayoutFooter />
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
