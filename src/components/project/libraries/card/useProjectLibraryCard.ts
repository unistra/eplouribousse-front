import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import type { ProjectDetails, ProjectLibrary } from '#/project.ts'
import { Roles } from '&/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'

export const useProjectLibraryCard = (library: ProjectLibrary) => {
    const projectStore = useProjectStore()
    const { useHandleError } = useUtils()

    const invitationsSelected = computed(() => {
        if (!projectStore.project) return []
        return projectStore.project.invitations.filter(
            (el) => el.role === Roles.Instructor && el.libraryId === library.id,
        )
    })

    const usersSelected = computed(() => {
        if (!projectStore.project) return []
        return projectStore.project.roles
            .filter((el) => el.role === Roles.Instructor && el.libraryId === library.id)
            .map((el) => el.user)
    })

    const isLoadingDelete = ref<boolean>(false)
    const onDelete = async () => {
        isLoadingDelete.value = true

        if (!projectStore.project?.libraries.some((lib) => lib.id === library.id)) return
        try {
            await axiosI.delete<ProjectDetails>(`/projects/${projectStore.project?.id}/libraries/`, {
                params: {
                    library_id: library.id,
                },
            })

            projectStore.project.libraries = projectStore.project.libraries.filter((lib) => lib.id !== library.id)
            projectStore.project.roles = projectStore.project.roles.filter((role) => role.libraryId !== library.id)
            projectStore.project.invitations = projectStore.project.invitations.filter(
                (inv) => inv.libraryId !== library.id,
            )
            projectStore.collectionsCount = projectStore.collectionsCount.filter((col) => col.libraryId === library.id)
        } catch (e) {
            useHandleError(e)
        } finally {
            isLoadingDelete.value = false
        }
    }

    const isAddUserLoading = ref<boolean>(false)
    const onAddInvitation = async (email: string) => {
        isAddUserLoading.value = true
        await projectStore.addInvitation(email, Roles.Instructor, library.id)
        isAddUserLoading.value = false
    }
    const onAddRole = async (userId: string) => {
        isAddUserLoading.value = true
        await projectStore.postProjectUserRole(userId, Roles.Instructor, library.id)
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
