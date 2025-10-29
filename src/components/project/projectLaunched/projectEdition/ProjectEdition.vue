<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/projectStore.ts'
import type { CollectionsInResource } from '#/project.ts'
import { useProjectEdition } from '@/components/project/projectLaunched/projectEdition/useProjectEdition.ts'
import { onMounted } from 'vue'

const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const { t } = useI18n()

const { selectCollectionToShowEdition } = useProjectEdition()

onMounted(() => {
    selectCollectionToShowEdition.value = resourceStore.collectionsSortedByOrderInInstructionTurns.filter(
        (el) => el.library === resourceStore.libraryIdSelected,
    )[0].id
})
</script>

<template>
    <div class="edition">
        <AtomicSelect
            v-model="selectCollectionToShowEdition"
            dense
            emit-value
            :label="t('project.resources.resultant.selectCollection')"
            map-options
            name="filter-positioning"
            :option-label="(el: CollectionsInResource) => projectStore.formatCollectionToString(el)"
            option-value="id"
            :options="
                resourceStore.collectionsSortedByOrderInInstructionTurns.filter(
                    (el) => el.library === resourceStore.libraryIdSelected,
                )
            "
        />
        <ProjectSegmentTable />
    </div>
</template>

<style scoped lang="sass">
.edition
    display: flex
    flex-direction: column
    width: 100%
    gap: 2rem
</style>
