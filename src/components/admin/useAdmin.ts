import { Roles } from '&/project'
import { axiosI } from '@/plugins/axios/axios'
import { Notify } from 'quasar'
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

    async function onAddRole(userId: string, role: Roles) {
        isAddUserLoading.value = true
        try {
            role === Roles.ProjectCreator
                ? await axiosI.post(`users/${userId}/project-creator/`, { userId })
                : await axiosI.post(`users/${userId}/tenant-superuser/`, { userId })
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            isAddUserLoading.value = false
        }
    }

    async function onRemoveRole(userId: string, role: Roles) {
        isAddUserLoading.value = true
        try {
            role === Roles.ProjectCreator
                ? await axiosI.delete(`users/${userId}/project-creator/`)
                : await axiosI.delete(`users/${userId}/tenant-superuser/`)
        } catch {
            Notify.create({
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
    }
}
