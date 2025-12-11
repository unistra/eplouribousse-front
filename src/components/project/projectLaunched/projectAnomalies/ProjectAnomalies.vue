<script setup lang="ts">
import ProjectSegmentTable from '@/components/project/projectSegmentTable/ProjectSegmentTable.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useResourceStore } from '@/stores/resourceStore.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useProjectAnomalies } from '@/components/project/projectLaunched/projectAnomalies/useProjectAnomalies.ts'
import { inject, type Ref } from 'vue'

const { t } = useI18n()
const resourceStore = useResourceStore()
const projectStore = useProjectStore()
const dialogModal = inject<Ref<boolean>>('dialogModal')

const { resetInstruction, reassignTurn } = useProjectAnomalies(dialogModal)
</script>

<template>
    <div class="anomalies">
        <ProjectSegmentTable />
        <div
            v-if="projectStore.userIsAdmin"
            class="buttons"
        >
            <AtomicButton
                color="primary"
                :disable="!!resourceStore.anomaliesUnfixed.length"
                :label="t('views.project.anomaly.tab.btnGiveTurn')"
                :no-border="!resourceStore.anomaliesUnfixed.length"
            >
                <QTooltip v-if="!!resourceStore.anomaliesUnfixed.length">
                    {{ t('views.project.anomaly.tab.btnGiveTurnDisableTooltip', 2) }}
                </QTooltip>
                <QMenu auto-close>
                    <QList>
                        <QItem
                            v-for="collection in resourceStore.collectionsSortedByOrderInInstructionTurns"
                            :key="collection.id"
                            clickable
                            @click="reassignTurn(collection)"
                        >
                            <QItemSection>
                                {{
                                    `${t('fn.collection.fields.position.i')}: ${collection.position} | ${t('fn.collection.fields.callNumber.i')}: ${collection.callNumber}`
                                }}
                            </QItemSection>
                        </QItem>
                        <QItem
                            clickable
                            @click="reassignTurn(undefined, true)"
                        >
                            <QItemSection>{{ t('views.project.anomaly.giveTurnToAController') }}</QItemSection>
                        </QItem>
                    </QList>
                </QMenu>
            </AtomicButton>
            <AtomicButton
                color="primary"
                confirm-button-color="primary"
                :label="t('views.project.anomaly.tab.btnReset')"
                no-border
                require-confirmation
                @confirm="resetInstruction"
            />
        </div>
    </div>
</template>

<style scoped lang="sass">
.anomalies
    display: flex
    flex-direction: column
    width: 100%
    gap: 2rem

    .buttons
        display: flex
        gap: 1rem
        justify-content: end
        align-items: center
</style>
