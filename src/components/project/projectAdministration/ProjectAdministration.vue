<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProjectAdministration } from './useProjectAdministration'
import ProjectAdministrationDispatcher from './ProjectAdministrationDispatcher.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { tabs, tab } = useProjectAdministration()
const { t } = useI18n()
</script>

<template>
    <div>
        <QTabs
            v-model="tab"
            align="left"
            dense
            no-caps
        >
            <QTab
                v-for="(value, index) in tabs"
                :key="index"
                :label="value.label"
                :name="value.name"
            >
            </QTab>
        </QTabs>
    </div>
    <div>
        <QTabPanels
            v-model="tab"
            animated
        >
            <QTabPanel
                v-for="(value, index) in tabs"
                :key="index"
                :name="value.name"
            >
                <ProjectAdministrationDispatcher :tab-name="value.name" />
            </QTabPanel>
        </QTabPanels>
        <AtomicButton label="Enregister" />
    </div>
    <!-- <QList>
        <QItem class="email-alerts">
            <p>{{ t('project.settings.emailAlert.title') }}</p>
            <QList class="toggles">
                <QItem
                    v-for="key in Object.keys(emailAlerts)"
                    :key="key"
                >
                    <AtomicToggle
                        v-model="emailAlerts[key as keyof typeof emailAlerts]"
                        :label="t(`project.settings.emailAlert.${key}`)"
                        left-label
                    />
                </QItem>
            </QList>
        </QItem>
        <QItem class="storage">
            <p>{{ t('project.settings.defaultStorageLocation') }}</p>
            <AtomicSelect
                :label="t('project.settings.defaultStorageLocation')"
                :options="storageOptions"
            />
        </QItem>
        <QItem>
            <AtomicToggle
                v-model="transferTracking"
                :label="t('project.settings.transferTracking')"
                left-label
            />
        </QItem>
        <QItem>
            <AtomicToggle
                v-model="treatmentTracking"
                :label="t('project.settings.treatmentTracking')"
                left-label
            />
        </QItem>
        <QItem class="exclusions">
            <p>{{ t('project.settings.exclusionReason') }}</p>
            <QList>
                <QItem
                    v-for="exclusionReason in store.settings.exclusionReasons"
                    :key="exclusionReason"
                >
                    <p>{{ exclusionReason }}</p>
                    <AtomicButton
                        icon="mdi-close"
                        no-border
                        size="xs"
                        @click="store.removeExclusionReason(exclusionReason)"
                    />
                </QItem>
                <QItem>
                    <AtomicButton
                        v-if="!addingExclusionReason"
                        icon="mdi-plus"
                        size="xs"
                        @click="addingExclusionReason = true"
                    />
                    <AtomicInput
                        v-else
                        v-model="newExclusionReason"
                        :label="t('project.settings.exclusionReason')"
                        quick-input
                        @cancel="onCancelAddExclusionReason"
                        @done="onAddExclusionReason"
                    />
                </QItem>
            </QList>
        </QItem>
    </QList> -->
</template>

<style lang="sass" scoped>
.tab
    font-size: 20px
    font-weight: 600

.email-alerts, .storage, .exclusions
    display: flex
    flex-direction: column

.exclusions
    .q-list
        .q-item
            display: flex
            align-items: center
            gap: 1rem
            .q-btn
                width: fit-content
</style>
