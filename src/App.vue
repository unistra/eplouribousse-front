<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import LayoutFooter from './components/layout/LayoutFooter.vue'
import LayoutHeader from './components/layout/LayoutHeader.vue'
import { useUserStore } from './stores/userStore'
import axiosI from './plugins/axios'

const userStore = useUserStore()

onMounted(async () => {
    const tenantInfo = await axiosI.get('/api/consortium/')

    if (window.location.href.includes('t1-eplouribousse')) {
        userStore.tenantConfiguration = {
            color: 'bg-green-8',
            tenantName: tenantInfo.data.name,
        }
    } else {
        userStore.tenantConfiguration = {
            color: 'bg-purple-8',
            tenantName: tenantInfo.data.name,
        }
    }
    if (localStorage.getItem('JWT__access__token') !== null) {
        userStore.isAuth = true
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
