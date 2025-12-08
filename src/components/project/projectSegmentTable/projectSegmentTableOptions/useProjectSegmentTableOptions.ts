import { computed, ref } from 'vue'
import type { Segment } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { Roles, Tab } from '&/project.ts'
import { useUserStore } from '@/stores/userStore.ts'
import {
    NULL_SEGMENT,
    useProjectSegmentTable,
} from '@/components/project/projectSegmentTable/useProjectSegmentTable.ts'

export const useProjectSegmentTableOptions = () => {
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const dialogUpdateSegment = ref<boolean>(false)
    const dialogDeleteSegment = ref<boolean>(false)
    const { loading } = useProjectSegmentTable()

    const orderSegment = async (row: Segment, direction: 'up' | 'down') => {
        loading.value = true
        await resourceStore.orderSegment(row, direction)
        loading.value = false
    }

    const checkACL = (row: Segment, keys: string[]) => {
        if (!row.acl) return false
        return keys.every((key) => row.acl[key])
    }

    const isUserAdminOnAnomaliesTab = computed(() => projectStore.userIsAdmin && projectStore.tab === Tab.Anomalies)
    const isUserInAnInstructionTab = computed(
        () => projectStore.tab === Tab.InstructionBound || projectStore.tab === Tab.InstructionUnbound,
    )

    const doesSegmentBelongToSelectedLibrary = (row: Segment) => {
        return (
            resourceStore.libraryIdSelected ===
            resourceStore.collections.find((el) => el.id === row.collection)?.library
        )
    }

    const isUserInstructorForSegment = (row: Segment): boolean => {
        if (!projectStore.project) return false
        const segmentCollectionLibraryId = resourceStore.collections.find((el) => el.id === row.collection)?.library
        return !!projectStore.project.roles.find(
            (el) =>
                el.role === Roles.Instructor &&
                el.user.id === userStore.user?.id &&
                el.libraryId === segmentCollectionLibraryId,
        )
    }

    const displayReorderButtons = (row: Segment) => {
        return (
            checkACL(row, ['up', 'down']) &&
            ((isUserInstructorForSegment(row) &&
                isUserInAnInstructionTab.value &&
                doesSegmentBelongToSelectedLibrary(row)) ||
                isUserAdminOnAnomaliesTab.value)
        )
    }

    const displayUpdateButton = (row: Segment) => {
        return (
            checkACL(row, ['partialUpdate']) &&
            ((isUserInstructorForSegment(row) &&
                isUserInAnInstructionTab.value &&
                doesSegmentBelongToSelectedLibrary(row)) ||
                isUserAdminOnAnomaliesTab.value)
        )
    }

    const displayDeleteButton = (row: Segment) => {
        return (
            checkACL(row, ['destroy']) &&
            ((isUserInstructorForSegment(row) &&
                isUserInAnInstructionTab.value &&
                doesSegmentBelongToSelectedLibrary(row)) ||
                isUserAdminOnAnomaliesTab.value)
        )
    }

    const displayInsertUnderButton = computed(() => {
        return (
            (projectStore.userIsInstructorForLibrarySelected && isUserInAnInstructionTab.value) ||
            isUserAdminOnAnomaliesTab.value
        )
    })

    const displayAddAnomalyButton = (row: Segment) => {
        return (
            (!(isUserInstructorForSegment(row) && doesSegmentBelongToSelectedLibrary(row)) &&
                isUserInAnInstructionTab.value) ||
            (projectStore.userIsController && projectStore.tab === Tab.Control)
        )
    }

    // Actions are disabled when there are anomalies, but if the admin gives control back to someone, there will be anomalies to resolve, and the instructor will be able to modify even if there are anomalies. So if there are only anomalies related to my segments, then I can modify, but if segments I don't control have anomalies, then it blocks.
    const areActionDisabled = computed<boolean>(() => {
        if (projectStore.userIsAdmin && projectStore.tab === Tab.Anomalies) return false
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

    const isPreviousSegmentANullSegment = (segment: Segment) => {
        return resourceStore.segments.find((el) => el.order === segment.order - 1)?.content === NULL_SEGMENT
    }

    return {
        displayReorderButtons,
        displayUpdateButton,
        displayDeleteButton,
        displayInsertUnderButton,
        displayAddAnomalyButton,
        orderSegment,
        doesSegmentBelongToSelectedLibrary,
        isUserAdminOnAnomaliesTab,
        isUserInAnInstructionTab,
        dialogUpdateSegment,
        dialogDeleteSegment,
        isUserInstructorForSegment,
        areActionDisabled,
        checkACL,
        isPreviousSegmentANullSegment,
    }
}
