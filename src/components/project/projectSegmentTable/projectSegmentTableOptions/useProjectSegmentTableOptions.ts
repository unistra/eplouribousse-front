import { computed, type ModelRef, ref } from 'vue'
import type { Segment } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Roles } from '&/project.ts'
import { useUserStore } from '@/stores/userStore.ts'

export const useProjectSegmentTableOptions = (loading: ModelRef<boolean | undefined>) => {
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()
    const userStore = useUserStore()
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
        const segmentCollectionLibraryId = resourceStore.collections.find((el) => el.id === row.collection)?.library
        return !!projectStore.roles.find(
            (el) =>
                el.role === Roles.Instructor &&
                el.user.id === userStore.user?.id &&
                el.libraryId === segmentCollectionLibraryId,
        )
    }

    // Actions are disabled when there are anomalies, but if the admin gives control back to someone, there will be anomalies to resolve, and the instructor will be able to modify even if there are anomalies. So if there are only anomalies related to my segments, then I can modify, but if segments I don't control have anomalies, then it blocks.
    const areActionDisabled = computed<boolean>(() => {
        if (!projectStore.userIsInstructorForLibrarySelected) return true

        const anomaliesThatAreAssocietedWithTheInstructorAndUnresolved = resourceStore.anomalies.filter((anomaly) => {
            const collectionThatIsAssociatedWithAnomaly = resourceStore.collections.find((collection) => {
                return (
                    resourceStore.segments.find((segment) => segment.id === anomaly.segment.id)?.collection ===
                    collection.id
                )
            })

            return collectionThatIsAssociatedWithAnomaly?.library === resourceStore.libraryIdSelected && !anomaly.fixed
        })

        return !(
            projectStore.userIsInstructorForLibrarySelected &&
            anomaliesThatAreAssocietedWithTheInstructorAndUnresolved.length ===
                resourceStore.anomalies.filter((anomaly) => !anomaly.fixed).length
        )
    })

    return {
        orderSegment,
        isSegmentCollectionLibrarySameAsLibrarySelected,
        dialogUpdateSegment,
        dialogDeleteSegment,
        userIsInstructorForSegmentCollectionLibrary,
        areActionDisabled,
    }
}
