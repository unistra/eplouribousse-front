<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from './composables/useComposableQuasar'
import { isExpired } from './utils/jwt'
import LayoutDrawer from './components/layout/LayoutDrawer.vue'

const userStore = useUserStore()
const { dark } = useComposableQuasar()

onMounted(async () => {
    const tenantInfo = await axiosI.get('/consortium/')
    const token = localStorage.getItem('JWT__access__token')
    if (tenantInfo.data.settings.color !== '') {
        userStore.tenant = tenantInfo.data.name
    }
    if (token !== null && !isExpired(token)) {
        userStore.isAuth = true
        const user = await axiosI.get('/users/profile/')
        userStore.user = user.data
        if (userStore.user?.settings.theme === 'dark') dark.set(true)
    }
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
    overflow-x: hidden;
    overflow-y: auto;
    height: 100vh;
}
</style>
