<script setup lang="ts">
import { useRoute } from 'vue-router'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useAdmin } from '@/components/admin/useAdmin.ts'
import { onMounted } from 'vue'
import { Roles } from '&/project.ts'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'

const route = useRoute()
const projectStore = useProjectStore()
const { roles, isAddUserLoading, onAddRole, onRemoveRole, getUsersWithRole, users } = useAdmin()
const globalStore = useGlobalStore()
const { t } = useI18n()
onMounted(async () => {
    await getUsersWithRole(Roles.ProjectCreator)
    await getUsersWithRole(Roles.TenantSuperUser)
})
</script>

<template>
    <QPage padding>
        <div class="hgroup">
            <h1>{{ route.meta.title }}</h1>
            <div class="tenant">
                <QChip class="chip-label-value">
                    {{ t('common.name') }}:
                    <span>{{ globalStore.tenant?.name }}</span>
                </QChip>
                <QChip class="chip-label-value">
                    {{ t('common.createdAt') }}
                    <span>{{
                        globalStore.tenant?.createdAt
                            ? useUtils().useIntlDateTimeFormat(globalStore.tenant.createdAt)
                            : '-'
                    }}</span>
                </QChip>
            </div>
        </div>
        <div class="roles">
            <h2>{{ t('view.tenantAdmin.section2') }}</h2>
            <div
                v-for="(role, index) in roles"
                :key="index"
                class="role"
            >
                <h2>{{ role.title }}</h2>
                <SearchUser
                    disable-invitations
                    :invitations-selected="projectStore.invitations.filter((el) => el.role === role.role)"
                    :is-add-user-loading="isAddUserLoading"
                    :prevent-delete-current-user="role.role === Roles.TenantSuperUser"
                    :users-selected="users[role.role]"
                    @add-user="async (user) => await onAddRole(user, role.role)"
                    @remove-user="async (user) => await onRemoveRole(user, role.role)"
                />
            </div>
        </div>
    </QPage>
</template>

<style lang="sass" scoped>
main
    display: flex
    flex-direction: column
    gap: 2rem
    .roles
        display: flex
        flex-direction: column
        gap: 1rem
        .role
            display: flex
            flex-direction: column
            gap: 1rem
</style>
