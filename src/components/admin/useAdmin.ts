import { Roles } from '&/project'
import { axiosI } from '@/plugins/axios/axios'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import type { Pagination } from '#/pagination.ts'
import type { UserSummarized } from '#/user.ts'

export function useAdmin() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()

    const isAddUserLoading = ref<boolean>(true)

    const roles: { title: string; role: Roles.ProjectCreator | Roles.TenantSuperUser }[] = [
        { title: t('fn.roles.superUser', 2), role: Roles.TenantSuperUser },
        { title: t('fn.roles.projectCreator', 2), role: Roles.ProjectCreator },
    ]

    const users = reactive<Record<Roles.ProjectCreator | Roles.TenantSuperUser, UserSummarized[]>>({
        project_creator: [],
        tenant_super_user: [],
    })
    const getUsersWithRole = async (role: Roles.ProjectCreator | Roles.TenantSuperUser) => {
        try {
            isAddUserLoading.value = true
            const response = await axiosI.get<Pagination<UserSummarized>>('/users/', {
                params: {
                    role,
                    page_size: 1000,
                },
            })
            users[role] = response.data.results
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            isAddUserLoading.value = false
        }
    }

    const onAddRole = async (user: UserSummarized, role: Roles.ProjectCreator | Roles.TenantSuperUser) => {
        isAddUserLoading.value = true
        try {
            await axiosI.post(`users/${user.id}/${role === Roles.ProjectCreator ? 'project-creator' : 'superuser'}/`)
            users[role].unshift(user)
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            isAddUserLoading.value = false
        }
    }

    const onRemoveRole = async (user: UserSummarized, role: Roles.ProjectCreator | Roles.TenantSuperUser) => {
        isAddUserLoading.value = true
        try {
            await axiosI.delete(`users/${user.id}/${role == Roles.ProjectCreator ? 'project-creator' : 'superuser'}/`)
            users[role] = users[role].filter((usr) => usr.id !== user.id)
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            isAddUserLoading.value = false
        }
    }

    return {
        isAddUserLoading,
        roles,
        onAddRole,
        onRemoveRole,
        getUsersWithRole,
        users,
    }
}
