<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore'
import { axiosI, axiosAuth } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from './composables/useComposableQuasar'
import { isExpired } from './utils/jwt'
import LayoutDrawer from './components/layout/LayoutDrawer.vue'

const userStore = useUserStore()
const { dark } = useComposableQuasar()

onMounted(async () => {
    const token = localStorage.getItem('JWT__access__token')
    const url = new URL(location.href)
    const prefix = url.host.split('.', 1)[0]

    if (import.meta.env.VITE_ENV === 'dev') {
        axiosI.defaults.baseURL = url.protocol + '//' + prefix + '.epl-api.localhost:8000/api'
        axiosAuth.defaults.baseURL = url.protocol + '//' + prefix + '.epl-api.localhost:8000'
    } else {
        const end = url.host.split('eplouribousse')[1]

        axiosI.defaults.baseURL = url.protocol + '//' + prefix + '-eplouribousse-api' + end + '/api'
        axiosAuth.defaults.baseURL = url.protocol + '//' + prefix + '-eplouribousse-api' + end
    }
    userStore.tenant = await (await axiosI.get('/consortium/')).data.name

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
    overflow-y: auto;
    height: 100vh;
}
</style>
