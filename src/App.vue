<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import LayoutFooter from './components/layout/LayoutFooter.vue'
import LayoutHeader from './components/layout/LayoutHeader.vue'
import { useUserStore } from './stores/userStore'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from './composables/useComposableQuasar'
import { isExpired } from './utils/jwt'

const userStore = useUserStore()
const { dark } = useComposableQuasar()

onMounted(async () => {
    const tenantInfo = await axiosI.get('/consortium/')
    const token = localStorage.getItem('JWT__access__token')
    if (tenantInfo.data.settings.color !== '') {
        userStore.tenantConfiguration = tenantInfo.data
    }
    if (token !== null && !isExpired(token)) {
        userStore.isAuth = true
        const user = await axiosI.get('/users/profile/')
        userStore.user = user.data
        userStore.isLocal = userStore.user.canAuthenticateLocally
        userStore.user.role = 'manager'
    }
    if (localStorage.getItem('darkMode') !== null && localStorage.getItem('darkMode') === 'true') {
        userStore.userPreferences.darkMode = true
        dark.set(true)
    }
})
</script>

<template>
    <QLayout view="hhh lpR fff">
        <LayoutHeader />
        <QPageContainer>
            <QPage padding>
                <RouterView />
            </QPage>
        </QPageContainer>
        <LayoutFooter />
    </QLayout>
</template>
