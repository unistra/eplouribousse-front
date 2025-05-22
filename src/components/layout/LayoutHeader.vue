<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import LayoutMenu from './LayoutMenu.vue'
import LayoutNavLinks from './LayoutNavLinks.vue'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { tenantConfiguration, tenantColor } = storeToRefs(userStore)
const rightDrawerOpen = ref<boolean>(false)
</script>

<template>
    <QHeader
        :style="tenantColor"
        elevated
    >
        <QToolbar>
            <QToolbarTitle>
                <QItem
                    clickable
                    to="/"
                    class="text-white"
                >
                    Eplouribousse - {{ tenantConfiguration?.name }}
                </QItem>
            </QToolbarTitle>
            <div class="navbar-links gt-md">
                <LayoutNavLinks />
            </div>
            <QBtn
                dense
                flat
                icon="mdi-menu"
                class="lt-lg"
                @click="rightDrawerOpen = !rightDrawerOpen"
            />
            <LayoutMenu />
        </QToolbar>
    </QHeader>
    <QDrawer
        v-model="rightDrawerOpen"
        :style="tenantColor"
        bordered
        side="right"
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
