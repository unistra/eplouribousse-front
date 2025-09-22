<script setup lang="ts">
import ProjectInstruction from '@/components/project/projectLaunched/projectInstruction/ProjectInstruction.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import ProjectPositioning from '@/components/project/projectLaunched/projectPositioning/ProjectPositioning.vue'
import type { Tab } from '#/project.ts'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useI18n } from 'vue-i18n'

const model = defineModel<boolean>()

defineProps<{
    tab: Tab
}>()

const resourceStore = useResourceStore()
const { t } = useI18n()
</script>

<template>
    <QDialog
        v-model="model"
        class="dialog"
        full-height
        full-width
    >
        <QCard>
            <QCardActions>
                <AtomicButton
                    icon="mdi-arrow-left"
                    no-border
                    @click="model = false"
                />
            </QCardActions>
            <QCardSection>
                <hgroup>
                    <h2>{{ resourceStore.title }}</h2>
                    <p>{{ resourceStore.code }}</p>
                </hgroup>
            </QCardSection>
            <QCardSection>
                <ProjectPositioning v-if="tab === 'positioning'" />
                <ProjectInstruction
                    v-else-if="
                        (tab === 'instructionBound' || tab === 'instructionUnbound') &&
                        resourceStore.resourceSelected?.id
                    "
                />
                <p v-else>{{ t('errors.unknown') }} {{ resourceStore.resourceSelected?.id || '' }}a</p>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="sass" scoped>
h2
    font-size: 1.5rem
    font-weight: bold
</style>
