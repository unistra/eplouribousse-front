import { Roles } from '&/project.ts'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'

export const useProjectRoles = () => {
    const { t } = useI18n()
    const projectStore = useProjectStore()

    const roles: {
        title: string
        role: Roles
    }[] = [
        { title: t('fn.roles.projectAdmin', 2), role: Roles.ProjectAdmin },
        { title: t('fn.roles.projectManager', 2), role: Roles.ProjectManager },
        { title: t('fn.roles.controller', 2), role: Roles.Controller },
        { title: t('fn.roles.guest', 2), role: Roles.Guest },
    ]

    const addUserLoadingBasedOnRole = ref<Roles | undefined>()
    const onAddInvitation = async (email: string, role: Roles) => {
        addUserLoadingBasedOnRole.value = role
        await projectStore.postProjectInvitation(email, role)
        addUserLoadingBasedOnRole.value = undefined
    }
    const onAddRole = async (userId: string, role: Roles) => {
        addUserLoadingBasedOnRole.value = role
        await projectStore.postProjectUserRole(userId, role)
        addUserLoadingBasedOnRole.value = undefined
    }

    return {
        roles,
        onAddRole,
        onAddInvitation,
        addUserLoadingBasedOnRole,
    }
}
