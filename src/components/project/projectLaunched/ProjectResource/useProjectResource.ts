import { ref } from 'vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useRoute, useRouter } from 'vue-router'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import type { CollectionsInResource } from '#/project.ts'
import { RESOURCE_QUERY_PARAM } from '@/components/project/projectLaunched/useProjectResources.ts'

export type ProjectResourceProps = {
    resourceIdSelected: string
}

export const useProjectResource = (props: ProjectResourceProps) => {
    const route = useRoute()
    const router = useRouter()
    const resourceStore = useResourceStore()
    const resourcesStore = useResourcesStore()

    const dialogLoading = ref<boolean>(false)

    const onBeforeShow = async () => {
        dialogLoading.value = true
        resourceStore.collections = []
        resourceStore.segments = []

        if (route.query[RESOURCE_QUERY_PARAM] && resourceStore.resource && resourceStore.collections.length) {
            resourceStore.collections.sort((a: CollectionsInResource, b: CollectionsInResource) => {
                if (!resourcesStore.libraryIdSelected) return 0
                const aMatch = a.library === resourcesStore.libraryIdSelected
                const bMatch = b.library === resourcesStore.libraryIdSelected
                return bMatch ? (aMatch ? 0 : 1) : aMatch ? -1 : 0
            })
            dialogLoading.value = false
            return
        }

        await resourceStore.getResourceAndRelatedCollections(props.resourceIdSelected)
        dialogLoading.value = false
    }

    const onModalClose = async () => {
        if (route.query[RESOURCE_QUERY_PARAM]) await router.replace(router.currentRoute.value.path) // To remove RESOURCE_QUERY_PARAM and prevent unexpected behaviors
    }

    return {
        dialogLoading,
        onBeforeShow,
        onModalClose,
    }
}
