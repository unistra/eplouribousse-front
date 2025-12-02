<script lang="ts" setup>
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useProjectRoles } from '@/components/project/stepper/steps/roles/useProjectRoles.ts'
import { useI18n } from 'vue-i18n'

defineProps<{ settingMode?: boolean }>()
const { roles, addUserLoadingBasedOnRole, onAddInvitation, onAddRole } = useProjectRoles()
const projectStore = useProjectStore()
const { t } = useI18n()
</script>

<template>
    <div
        v-if="projectStore.project"
        class="container"
    >
        <h1 v-if="!settingMode">{{ t('view.project.new.stepper.steps.roles.title') }}</h1>
        <div class="roles">
            <template
                v-for="role in roles"
                :key="role.role"
            >
                <SearchUser
                    :invitations-selected="projectStore.project.invitations.filter((el) => el.role === role.role)"
                    :is-add-user-loading="addUserLoadingBasedOnRole === role.role"
                    :label="role.title"
                    :role="role.role"
                    :summary-mode="settingMode && !projectStore.userIsAdmin"
                    :users-selected="
                        projectStore.project.roles.filter((el) => el.role === role.role).map((el) => el.user)
                    "
                    @add-invitation="async (email) => await onAddInvitation(email, role.role)"
                    @add-user="async (user) => await onAddRole(user.id, role.role)"
                    @remove-invitation="
                        async ({ email }) => await projectStore.deleteProjectInvitation(email, role.role)
                    "
                    @remove-user="async (user) => await projectStore.deleteProjectUserRole(user.id, role.role)"
                />
            </template>
        </div>
    </div>
</template>

<style scoped lang="sass">
.container
    display: flex
    flex-direction: column
    gap: 2rem
    h1
        font-size: var(--font-size-xl)
    .roles
        display: grid
        grid-template-columns: 1fr 1fr
        gap: 1rem
</style>
