import { type ModelRef, ref } from 'vue'
import type { Segment } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'

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

    return {
        orderSegment,
        isSegmentCollectionLibrarySameAsLibrarySelected,
        dialogUpdateSegment,
        dialogDeleteSegment,
    }
}
