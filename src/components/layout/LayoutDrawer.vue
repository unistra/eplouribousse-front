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

const { t } = useI18n()
const { logout } = useAuthentication()
const userStore = useUserStore()
const router = useRouter()
const { tenant, isAuth, user } = storeToRefs(userStore)

const drawer = ref<boolean>(true)
const collapsed = ref<boolean>(false)

watch(
    () => user.value,
    async () => {
        if (isAuth.value && user.value) {
            await userStore.getProjects()
        } else {
            userStore.projects = []
        }
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
                active-class=""
                class="logo"
                :to="{ name: 'Home' }"
            >
                <h1>Eplouribousse</h1>
                <p>{{ tenant }}</p>
            </QItem>
            <DrawerItem
                v-else
                icon="mdi-home"
                :to="{ name: 'Home' }"
                :tooltip="t('homePage')"
            />

            <QItem class="projects">
                <div>
                    <p v-if="!collapsed">
                        {{ t('navigation.projects') }}
                    </p>
                    <div :class="['scrollable-projects', { 'min-height': userStore.projects.length > 3 }]">
                        <QList v-if="userStore.projects.length > 0">
                            <DrawerItem
                                v-for="project in userStore.projects"
                                :key="project.id"
                                icon="mdi-book-multiple"
                                :name="!collapsed ? project.name : ''"
                                :to="{ name: 'project', params: { id: project.id } }"
                                :tooltip="collapsed ? project.name : undefined"
                            />
                        </QList>
                        <p v-if="!collapsed && !userStore.projects.length">
                            {{ t('navigation.noProject') }}
                        </p>
                    </div>
                </div>
                <div
                    v-if="user && user.isProjectCreator"
                    class="create-btn"
                >
                    <AtomicButton
                        v-if="!collapsed"
                        icon="mdi-plus"
                        :label="t('newProject.create')"
                        :no-border="userStore.projects.length > 0"
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


                p
                    color: var(--color-neutral-400)
                    font-style: italic
                    text-align: center
</style>
