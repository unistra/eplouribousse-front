<script setup lang="ts">
import ProjectInstruction from '@/components/project/projectLaunched/projectInstruction/ProjectInstruction.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import ProjectPositioning from '@/components/project/projectLaunched/projectPositioning/ProjectPositioning.vue'
import type { Tab } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'
import { provide, ref } from 'vue'
import ProjectControl from '@/components/project/projectLaunched/projectControl/ProjectControl.vue'

defineProps<{
    tab: Tab
}>()
const { t } = useI18n()
const resourceStore = useResourceStore()

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
                        <p>{{ resourceStore.code }}</p>
                    </hgroup>
                </QCardSection>
                <QCardSection class="content">
                    <ProjectPositioning v-if="tab === 'positioning'" />
                    <ProjectInstruction v-else-if="tab === 'instructionBound' || tab === 'instructionUnbound'" />
                    <ProjectControl v-else-if="tab === 'control'" />
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
</style>
