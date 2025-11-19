import { Roles } from '&/project.ts'
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
        { title: t('roles.projectAdmin'), role: Roles.ProjectAdmin },
        { title: t('roles.projectManager'), role: Roles.ProjectManager },
        { title: t('roles.controller'), role: Roles.Controller },
        { title: t('roles.guest'), role: Roles.Guest },
    ]

    const addUserLoadingBasedOnRole = ref<Roles | undefined>()
    const onAddInvitation = async (email: string, role: Roles) => {
        addUserLoadingBasedOnRole.value = role
        await store.addInvitation(email, role)
        addUserLoadingBasedOnRole.value = undefined
    }
    const onAddRole = async (userId: string, role: Roles) => {
        addUserLoadingBasedOnRole.value = role
        await store.addRole(userId, role)
        addUserLoadingBasedOnRole.value = undefined
    }

    return {
        roles,
        onAddRole,
        onAddInvitation,
        addUserLoadingBasedOnRole,
    }
}
