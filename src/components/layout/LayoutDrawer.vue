<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/globalStore.ts'
import DrawerItem from '../utils/drawerItem/DrawerItem.vue'
import AtomicButton from '../atomic/AtomicButton.vue'
import { Roles } from '&/project'

const { t } = useI18n()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const { user } = storeToRefs(userStore)

const drawer = ref<boolean>(true)
const collapsed = ref<boolean>(false)

watch(
    () => user.value,
    async () => {
        await userStore.getProjects()
    },
)

onMounted(async () => {
    await userStore.fetchUser()
})
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
                class="tenant-name"
                exact-active-class=""
            >
                <p>{{ globalStore.tenant?.name || '' }}</p>
            </QItem>
            <QItem class="projects">
                <div>
                    <DrawerItem
                        icon="mdi-folder-move-outline"
                        :name="!collapsed ? t('navigation.publicProjects') : ''"
                        :to="{ name: 'publicProjects' }"
                        :tooltip="collapsed ? t('navigation.publicProjects') : undefined"
                    />
                    <template v-if="userStore.isAuth">
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
                                        :to="{ name: 'projectAdmin', params: { id: project.id } }"
                                    />
                                </DrawerItem>
                            </QList>
                            <p v-else-if="!collapsed && !userStore.projects.length">
                                {{ t('navigation.noProject') }}
                            </p>
                        </div>
                    </template>
                </div>
                <div
                    v-if="user && user.isProjectCreator"
                    class="create-btn"
                >
                    <AtomicButton
                        v-if="!collapsed"
                        icon="mdi-plus"
                        :label="t('newProject.buttons.create', { article: t('common.a') })"
                        :no-border="userStore.projects.length < 0"
                        :to="{ name: 'newProject' }"
                    />
                    <DrawerItem
                        v-else
                        icon="mdi-plus"
                        :to="{ name: 'newProject' }"
                        :tooltip="t('newProject.buttons.create', { article: t('common.a') })"
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
                    v-if="!collapsed"
                    icon="mdi-arrow-collapse-left"
                    :name="t('navigation.collapse')"
                    @click="() => (collapsed = true)"
                />
                <DrawerItem
                    v-else
                    icon="mdi-arrow-collapse-right"
                    :tooltip="t('navigation.expand')"
                    @click="() => (collapsed = false)"
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
        flex-wrap: nowrap
        padding-top: 0.5rem
        justify-content: space-between

        > :first-child
            display: flex
            flex-direction: column
            gap: 1rem

        > :last-child
            display: flex
            flex-direction: column
            gap: 2rem

        .tenant-name
            display: flex
            flex-direction: column

            p
                font-size: 1.5rem
                font-weight: bold


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

            .create-btn
                display: flex
                flex-direction: column
</style>
