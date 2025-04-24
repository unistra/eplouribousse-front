<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import LayoutMenu from './LayoutMenu.vue'
import LayoutNavLinks from './LayoutNavLinks.vue'

const { t } = useI18n()
const userStore = useUserStore()
const rightDrawerOpen = ref<boolean>(false)
</script>

<template>
    <QHeader
        :class="userStore.tenantConfiguration.color"
        elevated
    >
        <QToolbar>
            <QToolbarTitle>
                <QItem
                    clickable
                    to="/"
                    class="text-white"
                >
                    Eplouribousse - {{ userStore.tenantConfiguration.tenantName }}
                </QItem>
            </QToolbarTitle>
            <div class="navbar-links gt-md">
                <LayoutNavLinks />
            </div>
            <QBtn
                dense
                flat
                icon="mdi-menu"
                @click="rightDrawerOpen = !rightDrawerOpen"
                class="lt-lg"
            />
            <LayoutMenu />
        </QToolbar>
    </QHeader>
    <QDrawer
        :class="userStore.tenantConfiguration.color"
        v-model="rightDrawerOpen"
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
