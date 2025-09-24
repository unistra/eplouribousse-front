import { Roles } from '&/project'
import { axiosI } from '@/plugins/axios/axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useAdmin() {
    const { t } = useI18n()

    const isAddUserLoading = ref<boolean>(true)
    const roles: {
        title: string
        role: Roles
    }[] = [
        { title: t('roles.superUser'), role: Roles.TenantSuperUser },
        { title: t('roles.projectCreator'), role: Roles.ProjectCreator },
    ]

    async function onAddRole(userId: string, _role: Roles) {
        isAddUserLoading.value = true
        try {
            await axiosI.post('', { userId })
        } catch {
        } finally {
            isAddUserLoading.value = false
        }
    }

    async function onRemoveRole(userId: string, _role: Roles) {
        isAddUserLoading.value = true
        try {
            await axiosI.post('', { userId })
        } catch {
        } finally {
            isAddUserLoading.value = false
        }
    }

    return {
        isAddUserLoading,
        roles,
        onAddRole,
        onRemoveRole,
    }
}
