<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/globalStore.ts'
import DrawerItem from '../utils/drawerItem/DrawerItem.vue'
import AtomicButton from '../atomic/AtomicButton.vue'
import { useAuthentication } from '@/composables/useAuthentication'
import { useRouter } from 'vue-router'
import { Roles } from '&/project'

const { t } = useI18n()
const { logout } = useAuthentication()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const router = useRouter()
const { user } = storeToRefs(userStore)

const drawer = ref<boolean>(true)
const collapsed = ref<boolean>(false)

watch(
    () => user.value,
    async () => {
        await userStore.getProjects()
    },
)

async function onLogout() {
    await logout()
    const { addNotify } = useGlobalStore()
    addNotify({
        message: t('logout.success'),
    })
    await router.push({ name: 'Home' })
}
</script>

<template>
    <QDrawer
        v-model="drawer"
        bordered
        class="drawer"
        :mini="collapsed"
        :mini-width="60"
        persistent
        side="left"
        :width="296"
    >
        <QList dense>
            <QItem
                v-if="!collapsed"
                class="logo"
                exact-active-class=""
                :to="{ name: 'Home' }"
            >
                <div class="heading-and-button">
                    <h1>Eplouribousse</h1>
                    <QIcon
                        name="mdi-arrow-collapse-left"
                        size="1.4rem"
                        :tooltip="t('navigation.collapse')"
                        @click.prevent="() => (collapsed = true)"
                    />
                </div>
                <p>{{ globalStore.tenant?.name || '' }}</p>
            </QItem>
            <template v-else>
                <div>
                    <DrawerItem
                        icon="mdi-home"
                        :to="{ name: 'Home' }"
                        :tooltip="t('homePage')"
                    />
                    <DrawerItem
                        icon="mdi-arrow-collapse-right"
                        :tooltip="t('navigation.expand')"
                        @click="() => (collapsed = false)"
                    />
                </div>
            </template>

            <QItem class="projects">
                <div>
                    <p v-if="!collapsed">
                        {{ t('navigation.projects') }}
                    </p>
                    <div :class="['scrollable-projects', { 'min-height': userStore.projects.length > 3 }]">
                        <QItem
                            v-if="userStore.userLoading"
                            class="q-spinner-container"
                        >
                            <QSpinner />
                        </QItem>
                        <QList v-else-if="!userStore.userLoading && user">
                            <DrawerItem
                                v-for="project in user.projects"
                                :key="project.id"
                                icon="mdi-book-multiple"
                                :name="!collapsed ? project.name : ''"
                                :to="{ name: 'project', params: { id: project.id } }"
                                :tooltip="collapsed ? project.name : undefined"
                            >
                                <AtomicButton
                                    v-if="project.roles.includes(Roles.ProjectAdmin)"
                                    dense
                                    flat
                                    icon="mdi-cog"
                                    round
                                    :to="{ name: 'projectAdministration', params: { id: project.id } }"
                                />
                            </DrawerItem>
                        </QList>
                        <p v-else-if="!collapsed && !userStore.projects.length">
                            {{ t('navigation.noProject') }}
                        </p>
                    </div>
                    <DrawerItem
                        icon="mdi-folder-move-outline"
                        :name="!collapsed ? t('navigation.publicProjects') : ''"
                        :to="{ name: 'publicProjects' }"
                        :tooltip="collapsed ? t('navigation.publicProjects') : undefined"
                    />
                </div>
                <div
                    v-if="user && user.isProjectCreator"
                    class="create-btn"
                >
                    <AtomicButton
                        v-if="!collapsed"
                        icon="mdi-plus"
                        :label="t('newProject.create')"
                        :no-border="userStore.projects.length < 0"
                        :to="{ name: 'newProject' }"
                    />
                    <DrawerItem
                        v-else
                        icon="mdi-plus"
                        :to="{ name: 'newProject' }"
                        :tooltip="t('newProject.create')"
                    />
                </div>
            </QItem>
        </QList>

        <QList dense>
            <div>
                <DrawerItem
                    icon="mdi-file-document"
                    :name="!collapsed ? t('navigation.userGuide') : ''"
                    :tooltip="collapsed ? t('navigation.userGuide') : ''"
                />
                <DrawerItem
                    icon="mdi-email"
                    :name="!collapsed ? t('navigation.contactAdmin') : ''"
                    :to="{ name: 'contactAdmin' }"
                    :tooltip="collapsed ? t('navigation.contactAdmin') : ''"
                />
            </div>

            <div>
                <DrawerItem
                    icon="mdi-cog-outline"
                    :name="!collapsed ? t('settings.core') : ''"
                    :tooltip="collapsed ? t('settings.core') : ''"
                />
                <DrawerItem
                    v-if="userStore.isAuth"
                    icon="mdi-account-circle"
                    :name="!collapsed ? t('settings.account') : ''"
                    :tooltip="collapsed ? t('settings.account') : ''"
                />
                <DrawerItem
                    v-if="userStore.isAuth"
                    icon="mdi-logout"
                    :name="!collapsed ? t('navigation.logout') : ''"
                    :tooltip="collapsed ? t('navigation.logout') : ''"
                    @click="onLogout"
                />
                <DrawerItem
                    v-if="!userStore.isAuth"
                    icon="mdi-login"
                    :name="!collapsed ? t('navigation.login') : ''"
                    :to="{ name: 'login' }"
                    :tooltip="collapsed ? t('navigation.login') : ''"
                />
            </div>
        </QList>
    </QDrawer>
</template>

<style lang="sass" scoped>
.q-drawer-container
    ::v-deep(.drawer)
        display: flex
        flex-direction: column
        justify-content: space-between
        flex-wrap: nowrap

        > .q-list
            display: flex
            flex-direction: column
            gap: 2rem

        .logo
            display: flex
            flex-direction: column

            .heading-and-button
                display: flex
                align-items: center
                gap: 2rem

                .q-icon
                    opacity: 0
                    transition: opacity 0.2s ease-in-out
                    padding: 0.2rem
                    color: var(--color-neutral-500)
                    &:hover
                        color: var(--color-neutral-600)

            &:hover
                .q-icon
                    opacity: 1



            h1
                font-size: 2rem
                font-weight: bold

            p
                font-size: 1.25rem

        .create-btn
            display: flex
            flex-direction: column

        .projects
            display: flex
            flex-direction: column
            gap: 1rem

            > :first-child
                display: flex
                flex-direction: column
                gap: 0.5rem

            .scrollable-projects
                overflow-y: auto
                max-height: calc(100vh - 550px)
                flex-grow: 1

                .min-height
                    min-height: 8rem

                .q-spinner-container
                    font-size: 1.5rem
                    display: flex
                    justify-content: center
                    align-items: center


                p
                    color: var(--color-neutral-400)
                    font-style: italic
                    text-align: center
</style>
