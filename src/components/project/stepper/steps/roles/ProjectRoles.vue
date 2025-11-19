<script lang="ts" setup>
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useProjectRoles } from '@/components/project/stepper/steps/roles/useProjectRoles.ts'
import { Roles } from '&/project'

const { roles, addUserLoadingBasedOnRole, onAddInvitation, onAddRole } = useProjectRoles()
const store = useProjectStore()
</script>

<template>
    <div class="roles">
        <template
            v-for="role in roles"
            :key="role.role"
        >
            <SearchUser
                :disable="role.role !== Roles.Guest"
                :invitations-selected="store.invitations.filter((el) => el.role === role.role)"
                :is-add-user-loading="addUserLoadingBasedOnRole === role.role"
                :label="role.title"
                :role="role.role"
                :users-selected="store.roles.filter((el) => el.role === role.role).map((el) => el.user)"
                @add-invitation="async (email) => await onAddInvitation(email, role.role)"
                @add-user="async (user) => await onAddRole(user.id, role.role)"
                @remove-invitation="async ({ email }) => await store.removeInvitation(email, role.role)"
                @remove-user="async (user) => await store.removeRole(user.id, role.role)"
            />
        </template>
    </div>
</template>

<style scoped lang="sass">
.roles
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1rem
</style>
