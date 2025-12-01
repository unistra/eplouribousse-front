import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import type { ProjectLibrary } from '#/project.ts'
import { Roles } from '&/project.ts'

export const useProjectLibraryCard = (library: ProjectLibrary) => {
    const projectStore = useProjectStore()

    const invitationsSelected = computed(() =>
        projectStore.invitations.filter((el) => el.role === Roles.Instructor && el.libraryId === library.id),
    )
    const usersSelected = computed(() =>
        projectStore.roles
            .filter((el) => el.role === Roles.Instructor && el.libraryId === library.id)
            .map((el) => el.user),
    )

    const isLoadingDelete = ref<boolean>(false)
    const onDelete = async () => {
        isLoadingDelete.value = true
        await projectStore.removeLibrary(library)
        isLoadingDelete.value = false
    }

    const isAddUserLoading = ref<boolean>(false)
    const onAddInvitation = async (email: string) => {
        isAddUserLoading.value = true
        await projectStore.addInvitation(email, Roles.Instructor, library.id)
        isAddUserLoading.value = false
    }
    const onAddRole = async (userId: string) => {
        isAddUserLoading.value = true
        await projectStore.addRole(userId, Roles.Instructor, library.id)
        isAddUserLoading.value = false
    }

    return {
        isLoadingDelete,
        onDelete,
        onAddInvitation,
        onAddRole,
        isAddUserLoading,
        invitationsSelected,
        usersSelected,
    }
}
