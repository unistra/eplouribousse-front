import { computed, reactive, toRefs } from 'vue'
import type { CollectionsInResource } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import { backendBaseURL } from '@/plugins/axios/axiosUtils.ts'

const state = reactive<{ selectCollectionToShowEdition: CollectionsInResource | undefined }>({
    selectCollectionToShowEdition: undefined,
})

export const useProjectEdition = () => {
    const resourceStore = useResourceStore()
    const projectStore = useProjectStore()
    const { t, locale } = useI18n()

    const pdfPreviewURL = (preview: boolean = true) => {
        if (!resourceStore.id || !state.selectCollectionToShowEdition?.id) return ''

        const url = new URL(`${backendBaseURL}/api/resources/${resourceStore.id}/resultant-report/`)
        url.search = new URLSearchParams({
            collection: state.selectCollectionToShowEdition?.id,
            preview: preview.toString(),
            lang: ['fr', 'en'].includes(locale.value) ? locale.value : 'en',
        }).toString()
        return url.toString()
    }

    const motherCollectionString = computed(() => {
        return resourceStore.formatCollectionToString(resourceStore.collectionsSortedByOrderInInstructionTurns[0])
    })

    const storageLocation = computed(() => {
        const alternativeStorageSite = projectStore.libraries.find((library) => library.isAlternativeStorageSite)
        return (
            alternativeStorageSite?.name ||
            projectStore.libraries.find(
                (library) => library.id === resourceStore.collectionsSortedByOrderInInstructionTurns[0].library,
            )?.name ||
            t('common.none')
        )
    })

    return {
        ...toRefs(state),
        pdfPreviewURL,
        motherCollectionString,
        storageLocation,
    }
}
