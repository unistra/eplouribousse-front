<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import SearchUser from '../utils/searchUser/SearchUser.vue'
import { useAdmin } from './useAdmin'

const store = useProjectStore()
const { roles, isAddUserLoading, onAddRole, onRemoveRole } = useAdmin()
</script>

<template>
    <div
        v-for="(role, index) in roles"
        :key="index"
        class="admin"
    >
        <p>{{ role.title }}</p>
        <SearchUser
            :invitations-selected="store.invitations.filter((el) => el.role === role.role)"
            :is-add-user-loading="isAddUserLoading"
            :users-selected="store.roles.filter((el) => el.role === role.role).map((el) => el.user)"
            @add-user="async (userId) => await onAddRole(userId, role.role)"
            @remove-user="async (userId) => await onRemoveRole(userId, role.role)"
        />
    </div>
</template>

<style lang="sass" scoped>
.admin
    display: flex
    flex-direction: column
    justify-content: space-evenly
    gap: 16px;
    padding-top: 2.5vh
    padding-bottom: 2.5vh
</style>
