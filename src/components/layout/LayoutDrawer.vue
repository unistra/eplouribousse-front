<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { tenantConfiguration } = storeToRefs(userStore)
import { useI18n } from 'vue-i18n'
import DrawerItem from '../utils/drawerItem/DrawerItem.vue'
import AtomicButton from '../atomic/AtomicButton.vue'

const { t } = useI18n()

const drawer = ref<boolean>(true)
const collapsed = ref<boolean>(false)
const names = ['Projet 1', 'Projet 2', 'Projet 3']
</script>

<template>
    <QDrawer
        :mini="collapsed"
        :mini-width="48"
        :width="296"
        v-model="drawer"
        bordered
        persistent
        side="left"
    >
        <div
            id="wrapper"
            :class="!collapsed ? 'layout1' : 'layout2'"
        >
            <div
                v-if="!collapsed"
                class="home-section"
            >
                <a href="/"><h1>Eplouribousse</h1></a>
                <p class="large medium">{{ tenantConfiguration?.name }}</p>
            </div>
            <div
                v-else
                class="home-section"
            >
                <DrawerItem
                    icon="mdi-home"
                    to="Home"
                    :tooltip="t('homePage')"
                />
            </div>

            <div class="projects-section">
                <p
                    v-if="!collapsed"
                    class="light"
                >
                    {{ t('navigation.projects') }}
                </p>
                <DrawerItem
                    :key="index"
                    :name="!collapsed ? name : ''"
                    v-for="(name, index) in names"
                    icon="mdi-book-multiple"
                />
                <div class="drawer-button">
                    <AtomicButton
                        v-if="!collapsed"
                        icon="mdi-plus"
                        :label="t('newProject.create')"
                    />
                    <DrawerItem
                        v-else
                        icon="mdi-plus"
                        :tooltip="t('newProject.create')"
                    />
                </div>
            </div>

            <div class="navigation-section">
                <DrawerItem
                    :name="!collapsed ? t('navigation.userGuide') : ''"
                    :tooltip="collapsed ? t('navigation.userGuide') : ''"
                    icon="mdi-file-document"
                />
                <DrawerItem
                    :name="!collapsed ? t('navigation.contactAdmin') : ''"
                    :tooltip="collapsed ? t('navigation.contactAdmin') : ''"
                    icon="mdi-email"
                    to="contactAdmin"
                />
            </div>

            <div class="user-section">
                <DrawerItem
                    :icon="collapsed ? 'mdi-arrow-collapse-right' : 'mdi-arrow-collapse-left'"
                    :name="!collapsed ? t('navigation.collapse') : ''"
                    :tooltip="collapsed ? t('navigation.expand') : ''"
                    @click="() => (collapsed = !collapsed)"
                />
                <DrawerItem
                    icon="mdi-cog-outline"
                    :name="!collapsed ? t('settings.core') : ''"
                    :tooltip="collapsed ? t('settings.core') : ''"
                />
                <DrawerItem
                    icon="mdi-account-circle"
                    :name="!collapsed ? t('settings.account') : ''"
                    :tooltip="collapsed ? t('settings.account') : ''"
                />
            </div>
        </div>
    </QDrawer>
</template>

<style lang="sass" scoped>
.layout1
    .home-section
        display: flex
        flex-direction: column
        padding-left: 0.5vw
        padding-right: 0.5vw
        margin-bottom: 1vh
        height: 10%

        &-collapsed
            display: flex
            flex-direction: column
            padding-left: 0.5vw
            padding-right: 0.5vw
            margin-bottom: 1vh
            height: 10%

    .home-section h1
        font-size: 1.6rem !important
        font-weight: bold
        line-height: 2.5vw

    .projects-section
        height: 60%
        margin-bottom: 1vh
        padding-left: 0.5vh

        .drawer-button
            display: flex
            justify-content: center
            padding: 1vw

    .navigation-section
        height: 12%
        margin-bottom: 1vh

    .user-section
        display: flex
        flex-direction: column
        height: 12%
        justify-content: flex-end

.layout2
    @extend .layout1
    .home-section
        display: flex
        flex-direction: column
        // margin-left: 0.5vw
        // margin-right: 0.5vw
        margin-bottom: 1vh
        height: 10%

    .projects-section
        // padding-left: 0.5vh

    .navigation-section

    .user-section
        // padding-left: 2vh

#wrapper
    height: 100%
</style>
