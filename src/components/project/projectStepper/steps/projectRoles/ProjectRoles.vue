<script lang="ts" setup>
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useProjectRoles } from '@/components/project/projectStepper/steps/projectRoles/useProjectRoles.ts'
import { Roles } from '&/project'

const { roles, isAddUserLoading, onAddInvitation, onAddRole } = useProjectRoles()
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
                :disable="role.role !== Roles.Guest"
                :invitations-selected="store.invitations.filter((el) => el.role === role.role)"
                :is-add-user-loading="isAddUserLoading"
                :role="role.role"
                :users-selected="store.roles.filter((el) => el.role === role.role).map((el) => el.user)"
                @add-invitation="async (email) => await onAddInvitation(email, role.role)"
                @add-user="async (user) => await onAddRole(user.id, role.role)"
                @remove-invitation="async ({ email }) => await store.removeInvitation(email, role.role)"
                @remove-user="async (user) => await store.removeRole(user.id, role.role)"
            />
        </div>
    </div>
</template>
