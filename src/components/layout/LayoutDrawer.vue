<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/globalStore.ts'
import DrawerItem from '../utils/drawerItem/DrawerItem.vue'
import AtomicButton from '../atomic/AtomicButton.vue'
import { useProjectsStore } from '@/stores/projectsStore.ts'

const { t } = useI18n()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const projectsStore = useProjectsStore()
const { user } = storeToRefs(userStore)

const drawer = ref<boolean>(true)
const collapsed = ref<boolean>(false)
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
                <AtomicButton
                    v-if="userStore.user?.isSuperuser"
                    icon="mdi-cog"
                    no-border
                    :to="{ name: 'tenantAdmin' }"
                />
            </QItem>
            <div class="projects">
                <DrawerItem
                    icon="mdi-folder-move-outline"
                    :name="!collapsed ? t('project.public.btn') : ''"
                    :to="{ name: 'projects' }"
                    :tooltip="collapsed ? t('project.public.btn') : undefined"
                />
                <div
                    v-if="userStore.isAuth"
                    class="my-projects"
                >
                    <p v-if="!collapsed">
                        {{ t('layout.drawer.myProjects') }}
                    </p>
                    <div :class="['scrollable-projects', { 'min-height': projectsStore.userProjects.length > 3 }]">
                        <QItem
                            v-if="projectsStore.userProjectsLoading"
                            class="q-spinner-container"
                        >
                            <QSpinner />
                        </QItem>
                        <QList v-else-if="projectsStore.userProjects.length">
                            <DrawerItem
                                v-for="project in projectsStore.userProjects"
                                :key="project.id"
                                icon="mdi-book-multiple"
                                :name="!collapsed ? project.name : ''"
                                :to="{ name: 'project', params: { id: project.id } }"
                                :tooltip="collapsed ? project.name : undefined"
                            />
                        </QList>
                        <p v-else>
                            {{ t('navigation.noProject') }}
                        </p>
                    </div>
                </div>
                <QItem
                    v-if="user && user.isProjectCreator"
                    class="create-btn"
                >
                    <AtomicButton
                        v-if="!collapsed"
                        icon="mdi-plus"
                        :label="t('newProject.buttons.create', { article: t('common.a') })"
                        :no-border="projectsStore.userProjects.length < 0"
                        :to="{ name: 'newProject' }"
                    />
                    <DrawerItem
                        v-else
                        icon="mdi-plus"
                        :to="{ name: 'newProject' }"
                        :tooltip="t('newProject.buttons.create', { article: t('common.a') })"
                    />
                </QItem>
            </div>
        </QList>

        <QList dense>
            <div>
                <DrawerItem
                    href="https://documentation.unistra.fr/DNUM/Services_documentaires/Eplouribousse/co/guide.html"
                    icon="mdi-file-document"
                    :name="!collapsed ? t('navigation.userGuide') : ''"
                    target="_blank"
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
            align-items: start
            justify-content: space-between

            p
                font-size: 1.5rem
                font-weight: bold
                flex-grow: 1


        .projects
            display: flex
            flex-direction: column
            gap: 1rem

            .my-projects
                padding-left: 1rem
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
