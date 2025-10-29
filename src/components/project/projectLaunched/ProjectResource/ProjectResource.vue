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

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()

const dialogModal = defineModel<boolean>()
provide('dialogModal', dialogModal)
const dialogLoading = ref<boolean>(false)

const onBeforeShow = async () => {
    dialogLoading.value = true
    if (resourceStore.resourceSelected) {
        resourceStore.collections = []
        resourceStore.segments = []
        await resourceStore.fetchResourceAndCollections(resourceStore.resourceSelected.id)
    }
    dialogLoading.value = false
}
</script>

<template>
    <QDialog
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
                v-else-if="!resourceStore.resourceSelected"
                class="centered"
            >
                <p>{{ t('errors.unknownRetry') }}</p>
            </QCardSection>
            <template v-else>
                <QCardSection>
                    <hgroup>
                        <h2>{{ resourceStore.title }}</h2>
                        <QChip>
                            {{ t('project.resources.code') }}: <span>{{ resourceStore.code || '-' }}</span>
                        </QChip>
                        <QChip>
                            ISSN: <span>{{ resourceStore.issn || '-' }}</span>
                        </QChip>
                        <QChip>
                            {{ t('project.resources.publicationHistory') }}:
                            <span>{{ resourceStore.publicationHistory || '-' }}</span>
                        </QChip>
                    </hgroup>
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
h2
    font-size: 1.5rem
    font-weight: bold
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

.q-chip
    span
        margin-left: 0.2rem
        font-weight: bold
</style>
