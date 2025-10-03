import { type ModelRef, ref } from 'vue'
import type { Segment } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Roles } from '&/project.ts'
import { useUserStore } from '@/stores/userStore.ts'

export const useProjectSegmentTableOptions = (loading: ModelRef<boolean | undefined>) => {
    const resourceStore = useResourceStore()
    const dialogUpdateSegment = ref<boolean>(false)
    const dialogDeleteSegment = ref<boolean>(false)

    const orderSegment = async (row: Segment, direction: 'up' | 'down') => {
        loading.value = true
        await resourceStore.orderSegment(row, direction)
        loading.value = false
    }

    const isSegmentCollectionLibrarySameAsLibrarySelected = (row: Segment) => {
        return (
            resourceStore.libraryIdSelected ===
            resourceStore.collections.find((el) => el.id === row.collection)?.library
        )
    }

    const userIsInstructorForSegmentCollectionLibrary = (row: Segment): boolean => {
        const projectStore = useProjectStore()
        const userStore = useUserStore()
        const segmentCollectionLibraryId = resourceStore.collections.find((el) => el.id === row.collection)?.library
        return !!projectStore.roles.find(
            (el) =>
                el.role === Roles.Instructor &&
                el.user.id === userStore.user?.id &&
                el.libraryId === segmentCollectionLibraryId,
        )
    }

    return {
        orderSegment,
        isSegmentCollectionLibrarySameAsLibrarySelected,
        dialogUpdateSegment,
        dialogDeleteSegment,
        userIsInstructorForSegmentCollectionLibrary,
    }
}
