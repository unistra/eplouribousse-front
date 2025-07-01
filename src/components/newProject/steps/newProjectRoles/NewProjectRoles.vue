<script lang="ts" setup>
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { useI18n } from 'vue-i18n'
import type { Roles } from '#/project'
import { useProjectStore } from '@/stores/projectStore.ts'

const { t } = useI18n()
const store = useProjectStore()

const roles: {
    title: string
    role: Roles
}[] = [
    { title: t('roles.projectAdmin'), role: 'project_admin' },
    { title: t('roles.projectManager'), role: 'project_manager' },
    { title: t('roles.controller'), role: 'controller' },
]
</script>

<template>
    <div class="container">
        <div
            v-for="(role, index) in roles"
            :key="index"
            class="container column base"
        >
            <p>{{ role.title }}</p>
            <SearchUser
                :invitations-selected="store.invitations.filter((el) => el.role === role.role)"
                :users-selected="store.roles.filter((el) => el.role === role.role).map((el) => el.user)"
                @add-invitation="async (email) => await store.addInvitation(email, role.role)"
                @add-user="async (userId) => await store.addRole(userId, role.role)"
                @remove-invitation="async ({ email }) => await store.removeInvitation(email, role.role)"
                @remove-user="async (userId) => await store.removeRole(userId, role.role)"
            />
        </div>
    </div>
</template>
