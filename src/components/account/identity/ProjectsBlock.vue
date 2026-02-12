<script setup lang="ts">
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useProjectBlock } from '@/components/account/identity/useProjectBlock.ts'
import { useI18n } from 'vue-i18n'
import ProjectsTable from '@/components/projects/ProjectsTable.vue'
import { ProjectSettingsAlertsLabel } from '&/project.ts'

const { t } = useI18n()
const {
    isDifferenceBetweenUserSettingsAndInitial,
    userSettingsAlertsFormatted,
    patchUserAlerts,
    rolesInProjectSelected,
    selectedProject,
    dialog,
    onRowClick,
    alertKeys,
} = useProjectBlock()
</script>

<template>
    <div class="block-projects">
        <h2>{{ t('fn.project.my') }}</h2>
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
                        <p>{{ t('views.account.projects.rolesInProject') }} :</p>
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
                            {{ t('views.account.projects.alerts.title') }}
                            <QIcon name="mdi-information-outline" />
                            <QTooltip size="md">{{ t('views.account.projects.alerts.info') }}</QTooltip>
                        </p>
                        <div
                            v-if="alertKeys.length"
                            class="alerts-toggles"
                        >
                            <template
                                v-for="key in alertKeys"
                                :key="key"
                            >
                                <AtomicToggle
                                    v-if="key !== 'preservation' && key !== 'transfer'"
                                    v-model="userSettingsAlertsFormatted[key]"
                                    :label="ProjectSettingsAlertsLabel[key]"
                                />
                            </template>
                        </div>
                        <div
                            v-else
                            class="no-alert"
                        >
                            {{ t('views.account.projects.alerts.noAlert') }}
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
