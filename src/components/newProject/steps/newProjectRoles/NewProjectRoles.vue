<script lang="ts" setup>
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { useNewProjectRoles } from '@/components/newProject/steps/newProjectRoles/useNewProjectRoles.ts'
import { useProjectStore } from '@/stores/projectStore.ts'

const { roles, isAddUserLoading, onAddInvitation, onAddRole } = useNewProjectRoles()
const store = useProjectStore()
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
                :is-add-user-loading="isAddUserLoading"
                :users-selected="store.roles.filter((el) => el.role === role.role).map((el) => el.user)"
                @add-invitation="async (email) => await onAddInvitation(email, role.role)"
                @add-user="async (userId) => await onAddRole(userId, role.role)"
                @remove-invitation="async ({ email }) => await store.removeInvitation(email, role.role, null)"
                @remove-user="async (userId) => await store.removeRole(userId, role.role)"
            />
        </div>
    </div>
</template>
