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
        v-model="drawer"
        bordered
        :mini="collapsed"
        :mini-width="48"
        persistent
        side="left"
        :width="296"
    >
        <div
            id="wrapper"
            :class="!collapsed ? 'layout1' : 'layout2'"
        >
            <div
                v-if="!collapsed"
                id="home-section"
                class="drawer-item"
            >
                <a href="/"><h1>Eplouribousse</h1></a>
                <p class="large medium">{{ tenantConfiguration?.name }}</p>
            </div>
            <div
                v-else
                id="home-section"
                class="drawer-item"
            >
                <DrawerItem
                    icon="mdi-home"
                    to="Home"
                    :tooltip="t('homePage')"
                />
            </div>

            <div
                id="projects-section"
                :class="!collapsed ? 'drawer-item' : 'drawer-item-no-padding'"
            >
                <p
                    v-if="!collapsed"
                    class="light"
                >
                    {{ t('navigation.projects') }}
                </p>
                <DrawerItem
                    v-for="(name, index) in names"
                    :key="index"
                    icon="mdi-book-multiple"
                    :name="name"
                />
                <div
                    v-if="!collapsed"
                    class="drawer-button"
                >
                    <AtomicButton
                        icon="mdi-plus"
                        label="Créer un projet"
                    />
                </div>
            </div>

            <div
                id="navigation-section"
                class="drawer-item-no-padding"
            >
                <DrawerItem
                    icon="mdi-file-document"
                    :name="t('navigation.userGuide')"
                />
                <DrawerItem
                    icon="mdi-email"
                    :name="t('navigation.contactAdmin')"
                    to="contactAdmin"
                />
            </div>

            <div
                id="user-section"
                class="drawer-item-no-padding"
            >
                <DrawerItem
                    :icon="collapsed ? 'mdi-arrow-collapse-right' : 'mdi-arrow-collapse-left'"
                    :name="t('navigation.collapse')"
                    @click="() => (collapsed = !collapsed)"
                />
                <DrawerItem
                    icon="mdi-cog-outline"
                    :name="t('settings.core')"
                />
                <DrawerItem
                    icon="mdi-account-circle"
                    :name="t('settings.account')"
                />
            </div>
        </div>
    </QDrawer>
</template>

<style lang="sass" scoped>
.layout1
    .drawer-item
        display: flex
        flex-direction: column
        padding-left: 0.5vw
        padding-right: 0.5vw
        margin-bottom: 1vh

        &-no-padding
            margin-bottom: 1vh
            padding-left: 0

    .drawer-item h1
        font-size: 1.6rem !important
        font-weight: bold
        line-height: 2.5vw

    .drawer-button
        display: flex
        padding: 1vw

.layout2

#wrapper
    height: 100%
    background-color: gold

#home-section
    height: 10%
    background-color: aliceblue

#projects-section
    height: 60%
    background-color: aliceblue

#navigation-section
    height: 12%
    background-color: aliceblue

#user-section
    height: 12%
    background-color: aliceblue
</style>
