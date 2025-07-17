import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import type { ProjectLibrary } from '#/project'

export const useNewProjectLibraryCard = (library: ProjectLibrary) => {
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
        await store.addInvitation(email, 'instructor', library.id)
        isAddUserLoading.value = false
    }
    const onAddRole = async (userId: string) => {
        isAddUserLoading.value = true
        await store.addRole(userId, 'instructor', library.id)
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
