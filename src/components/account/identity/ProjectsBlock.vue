<script setup lang="ts">
import type { AlertKey } from '#/project.ts'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useProjectBlock } from '@/components/account/identity/useProjectBlock.ts'
import { useI18n } from 'vue-i18n'
import ProjectsTable from '@/components/projects/ProjectsTable.vue'

const { t } = useI18n()
const {
    isDifferenceBetweenUserSettingsAndInitial,
    userSettingsAlertsFormatted,
    patchUserAlerts,
    rolesInProjectSelected,
    selectedProject,
    dialog,
    onRowClick,
} = useProjectBlock()
</script>

<template>
    <div class="block-projects">
        <h2>{{ t('account.projects.myProjects', 2) }}</h2>
        <ProjectsTable
            user-specific
            @row-click="onRowClick"
        />
        <QDialog v-model="dialog.isOpen">
            <QCard>
                <QSpinner
                    v-if="dialog.loading"
                    size="md"
                />
                <template v-else-if="selectedProject">
                    <QCardSection>
                        <h3>{{ selectedProject.name || '' }}</h3>
                    </QCardSection>
                    <QCardSection>
                        <p>{{ t('account.projects.rolesInProject') }}:</p>
                        <ul class="roles">
                            <li
                                v-for="(role, index) in rolesInProjectSelected"
                                :key="index"
                            >
                                {{ role }}
                            </li>
                        </ul>
                    </QCardSection>

                    <QCardSection class="alerts">
                        <p class="alert-title">
                            {{ t('account.projects.alerts.title') }}
                            <QIcon name="mdi-information-outline" />
                            <QTooltip size="md">{{ t('account.projects.alerts.info') }}</QTooltip>
                        </p>
                        <div
                            v-if="Object.entries(userSettingsAlertsFormatted).length"
                            class="alerts-toggles"
                        >
                            <template
                                v-for="alert in Object.entries(userSettingsAlertsFormatted)"
                                :key="alert[0]"
                            >
                                <AtomicToggle
                                    v-if="alert[0] !== 'preservation' && alert[0] !== 'transfer'"
                                    v-model="userSettingsAlertsFormatted[alert[0] as AlertKey]"
                                    :label="t(`project.settings.emailAlert.${alert[0]}`)"
                                />
                            </template>
                        </div>
                        <div
                            v-else
                            class="no-alert"
                        >
                            {{ t('account.projects.alerts.noAlert') }}
                        </div>
                    </QCardSection>
                    <QCardActions
                        v-if="isDifferenceBetweenUserSettingsAndInitial"
                        align="right"
                    >
                        <AtomicButton
                            :label="t('common.save')"
                            @click="patchUserAlerts"
                        />
                    </QCardActions>
                </template>
            </QCard>
        </QDialog>
    </div>
</template>

<style scoped lang="sass">
.q-card
    min-width: 200px
    min-height: 400px
    display: flex
    flex-direction: column

    .q-spinner
        margin: auto

    .alert-title
        width: fit-content

    .alerts
        display: flex
        flex-direction: column
        gap: 1rem
        .alerts-toggles
            display: flex
            flex-direction: column
        .no-alert
            color: var(--color-neutral-500)
            display: flex
            justify-content: center
            font-style: italic
</style>
