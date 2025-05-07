<script lang="ts" setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import LayoutFooter from './components/layout/LayoutFooter.vue'
import LayoutHeader from './components/layout/LayoutHeader.vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

onMounted(() => {
    // for simulation purposes
    if (window.location.href.includes('t1-eplouribousse')) {
        userStore.tenantConfiguration = {
            color: 'bg-green-8',
            tenantName: 'Strasbourg',
        }
    } else {
        userStore.tenantConfiguration = {
            color: 'bg-purple-8',
            tenantName: 'Pau',
        }
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
