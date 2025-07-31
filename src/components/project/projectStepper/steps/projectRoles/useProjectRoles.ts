import type { Roles } from '#/project'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'

export const useProjectRoles = () => {
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

    const isAddUserLoading = ref<boolean>(false)
    const onAddInvitation = async (email: string, role: Roles) => {
        isAddUserLoading.value = true
        await store.addInvitation(email, role)
        isAddUserLoading.value = false
    }
    const onAddRole = async (userId: string, role: Roles) => {
        isAddUserLoading.value = true
        await store.addRole(userId, role)
        isAddUserLoading.value = false
    }

    return {
        roles,
        onAddRole,
        onAddInvitation,
        isAddUserLoading,
    }
}
