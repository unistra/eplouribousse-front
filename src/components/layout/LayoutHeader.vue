<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { tenantConfiguration, tenantColor } = storeToRefs(userStore)
const rightDrawerOpen = ref<boolean>(false)
</script>

<template>
    <QHeader
        elevated
        :style="tenantColor"
    >
        <QToolbar>
            <QToolbarTitle>
                <QItem
                    class="text-white"
                    clickable
                    to="/"
                >
                    Eplouribousse - {{ tenantConfiguration?.name }}
                </QItem>
            </QToolbarTitle>
            <div class="navbar-links gt-md">
                <!--                <LayoutNavLinks />-->
            </div>
            <QBtn
                class="lt-lg"
                dense
                flat
                icon="mdi-menu"
                @click="rightDrawerOpen = !rightDrawerOpen"
            />
            <!--            <LayoutMenu />-->
        </QToolbar>
    </QHeader>
    <QDrawer
        v-model="rightDrawerOpen"
        bordered
        side="right"
        :style="tenantColor"
    >
        <QList>
            <LayoutNavLinks />
        </QList>
    </QDrawer>
</template>

<style scoped>
.navbar-links {
    display: flex;
    align-items: center;
}
</style>
