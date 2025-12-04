<script setup lang="ts">
import ProjectInstruction from '@/components/project/projectLaunched/projectInstruction/ProjectInstruction.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import ProjectPositioning from '@/components/project/projectLaunched/projectPositioning/ProjectPositioning.vue'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'
import { provide, ref } from 'vue'
import ProjectControl from '@/components/project/projectLaunched/projectControl/ProjectControl.vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import ProjectAnomalies from '@/components/project/projectLaunched/projectAnomalies/ProjectAnomalies.vue'
import { Tab } from '&/project.ts'
import ProjectEdition from '@/components/project/projectLaunched/projectEdition/ProjectEdition.vue'
import { useResourcesStore } from '@/stores/resourcesStore.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { CollectionsInResource, CollectionsWithResource } from '#/project.ts'
import { useUtils } from '@/composables/useUtils.ts'

const props = defineProps<{
    resourceIdSelected: string
}>()

const { t } = useI18n()
const { useHandleError } = useUtils()
const resourceStore = useResourceStore()
const resourcesStore = useResourcesStore()
const projectStore = useProjectStore()

const dialogModal = defineModel<boolean>()
provide('dialogModal', dialogModal)
const dialogLoading = ref<boolean>(false)

const getResourceAndRelatedCollections = async () => {
    try {
        const response = await axiosI.get<CollectionsWithResource>(
            `/resources/${props.resourceIdSelected}/collections/`,
            {
                params: {
                    project_id: projectStore.project?.id,
                },
            },
        )

        resourceStore.resource = response.data.resource

        resourceStore.collections = response.data.collections.sort(
            (a: CollectionsInResource, b: CollectionsInResource) => {
                if (!resourcesStore.libraryIdSelected) return 0
                const aMatch = a.library === resourcesStore.libraryIdSelected
                const bMatch = b.library === resourcesStore.libraryIdSelected
                return bMatch ? (aMatch ? 0 : 1) : aMatch ? -1 : 0
            },
        )
    } catch (e) {
        useHandleError(e)
    }
}

const onBeforeShow = async () => {
    dialogLoading.value = true

    resourceStore.collections = []
    resourceStore.segments = []

    await getResourceAndRelatedCollections()

    dialogLoading.value = false
}
</script>

<template>
    <QDialog
        v-if="projectStore.project"
        v-model="dialogModal"
        class="dialog"
        full-height
        full-width
        @before-show="onBeforeShow"
    >
        <QCard>
            <QCardActions>
                <AtomicButton
                    icon="mdi-arrow-left"
                    no-border
                    @click="dialogModal = false"
                />
            </QCardActions>
            <QCardSection
                v-if="dialogLoading"
                class="centered"
            >
                <QSpinner size="2rem" />
            </QCardSection>
            <QCardSection
                v-else-if="resourceIdSelected === ''"
                class="centered"
            >
                <p>{{ t('errors.unknownRetry') }}</p>
            </QCardSection>
            <template v-else>
                <QCardSection>
                    <template v-if="projectStore.tab === Tab.Edition">
                        <h2>
                            {{
                                projectStore.project.libraries.find((el) => el.id === resourcesStore.libraryIdSelected)
                                    ? projectStore.project.libraries.find(
                                          (el) => el.id === resourcesStore.libraryIdSelected,
                                      )?.name + ':'
                                    : ''
                            }}
                            {{ t('project.resources.resultant.title') }}
                        </h2>
                        <h3>{{ resourceStore.resource?.title }}</h3>
                    </template>
                    <h2 v-else>{{ resourceStore.resource?.title }}</h2>

                    <QChip class="chip-label-value">
                        {{ t('project.resources.code') }}: <span>{{ resourceStore.resource?.code || '-' }}</span>
                    </QChip>
                    <QChip class="chip-label-value">
                        ISSN: <span>{{ resourceStore.resource?.issn || '-' }}</span>
                    </QChip>
                    <QChip class="chip-label-value">
                        {{ t('project.resources.publicationHistory') }}:
                        <span>{{ resourceStore.resource?.publicationHistory || '-' }}</span>
                    </QChip>
                </QCardSection>
                <QCardSection class="content">
                    <ProjectPositioning v-if="projectStore.tab === Tab.Positioning" />
                    <ProjectInstruction
                        v-else-if="
                            projectStore.tab === Tab.InstructionBound || projectStore.tab === Tab.InstructionUnbound
                        "
                    />
                    <ProjectControl v-else-if="projectStore.tab === Tab.Control" />
                    <ProjectAnomalies v-else-if="projectStore.tab === Tab.Anomalies" />
                    <ProjectEdition v-else-if="projectStore.tab === Tab.Edition" />
                    <p v-else>Unsupported status for Resource</p>
                </QCardSection>
            </template>
        </QCard>
    </QDialog>
</template>

<style lang="sass" scoped>
.q-card
    display: flex
    flex-direction: column
    .content
        display: flex
        flex-grow: 1

    .centered
        display: flex
        align-items: center
        justify-content: center
        flex-grow: 1
</style>
