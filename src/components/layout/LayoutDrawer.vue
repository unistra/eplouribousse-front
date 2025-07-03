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
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import type { ProjectI } from '#/project'

const { t } = useI18n()
const { logout } = useAuthentication()
const userStore = useUserStore()
const router = useRouter()
const { tenantConfiguration } = storeToRefs(userStore)

const drawer = ref<boolean>(true)
const collapsed = ref<boolean>(false)
const projects = ref<ProjectI[]>([])

watch(
    () => userStore.isAuth,
    async (isAuth) => {
        if (isAuth) {
            const dataProjects = await axiosI.get<Pagination<ProjectI>>('/projects/', {
                params: {
                    page_size: 100,
                },
            })
            projects.value = dataProjects.data.results
        } else {
            projects.value = []
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
        :mini="collapsed"
        :mini-width="50"
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
                <template v-if="projects.length > 0">
                    <DrawerItem
                        v-for="project in projects"
                        :key="project.id"
                        icon="mdi-book-multiple"
                        :name="!collapsed ? project.name : ''"
                        :to="{ name: 'project', params: { id: project.id } }"
                    />
                </template>
                <p
                    v-else
                    class="no-project"
                >
                    {{ t('navigation.noProject') }}
                </p>
                <div class="drawer-button">
                    <AtomicButton
                        v-if="!collapsed"
                        icon="mdi-plus"
                        :label="t('newProject.create')"
                        :to="{ name: 'newProject' }"
                    />
                    <DrawerItem
                        v-else
                        icon="mdi-plus"
                        :to="{ name: 'newProject' }"
                        :tooltip="t('newProject.create')"
                    />
                </div>
            </div>

            <div class="navigation-section">
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
                    to="login"
                    :tooltip="collapsed ? t('navigation.login') : ''"
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
        margin-left: 0.5vw
        margin-bottom: 1vh

    .home-section h1
        font-size: 1.6rem !important
        font-weight: bold
        line-height: 5vh

    .projects-section
        margin-bottom: 10vh
        margin-left: 0.5vw

        .drawer-button
            display: flex
            justify-content: center
            padding: 1vw

    .navigation-section
        display: flex
        flex-direction: column
        row-gap: 1vh
        margin-bottom: 3vh

    .user-section
        display: flex
        flex-direction: column
        row-gap: 1vh


.layout2
    @extend .layout1

    .projects-section
        padding-bottom: 10vh

    .navigation-section
        margin-left: 0.5vw

    .user-section
        margin-left: 0.5vw

#wrapper
    height: 100%

.no-project
    color: var(--color-grey-400)
    font-style: italic
    text-align: center
</style>
