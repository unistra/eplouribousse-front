import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import type { ProjectLibrary } from '#/project.ts'
import { Roles } from '&/project.ts'

export const useProjectLibraryCard = (library: ProjectLibrary) => {
    const store = useProjectStore()

    const isLoadingDelete = ref<boolean>(false)
    const onDelete = async () => {
        isLoadingDelete.value = true
        await store.removeLibrary(library)
        isLoadingDelete.value = false
    }

    const isAddUserLoading = ref<boolean>(false)
    const onAddInvitation = async (email: string) => {
        isAddUserLoading.value = true
        await store.addInvitation(email, Roles.Instructor, library.id)
        isAddUserLoading.value = false
    }
    const onAddRole = async (userId: string) => {
        isAddUserLoading.value = true
        await store.addRole(userId, Roles.Instructor, library.id)
        isAddUserLoading.value = false
    }

    return {
        isLoadingDelete,
        onDelete,
        onAddInvitation,
        onAddRole,
        isAddUserLoading,
    }
}
