<script setup lang="ts">
import { onMounted } from 'vue'
import type { AlertKey } from '#/project.ts'
import type { QTableColumn } from 'quasar'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useProjectBlock } from '@/components/account/identity/useProjectBlock.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const {
    isDifferenceBetweenUserSettingsAndInitial,
    userSettingsAlertsFormatted,
    patchUserAlerts,
    rolesInProjectSelected,
    selectedProject,
    table,
    dialog,
} = useProjectBlock()

onMounted(async () => {
    await table.onRequest()
})
</script>

<template>
    <div class="block-projects">
        <h2>{{ t('account.projects.myProjects', 2) }}</h2>
        <QTable
            v-model:pagination="table.pagination.value"
            binary-state-sort
            :columns="table.columns as QTableColumn[]"
            :filter="table.filter"
            flat
            :loading="table.loading.value"
            row-key="id"
            :rows="table.rows.value"
            :rows-per-page-options="table.rowsPerPage"
            @request="table.onRequest"
            @row-click="table.onRowClick"
        >
            <template #top-right>
                <QInput
                    v-model="table.filter.value"
                    debounce="1000"
                    dense
                    :placeholder="t('common.search')"
                >
                    <template v-slot:append>
                        <QIcon name="mdi-magnify" />
                    </template>
                </QInput>
            </template>
        </QTable>
        <QDialog v-model="dialog.isOpen">
            <QCard>
                <QSpinner
                    v-if="dialog.loading"
                    size="md"
                />
                <template v-else-if="selectedProject">
                    <QCardSection>
                        <p class="project-name">{{ selectedProject.name || '' }}</p>
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

                    <QCardSection>
                        <p class="alert-title">
                            {{ t('account.projects.alerts.title') }}
                            <QIcon name="mdi-information-outline" />
                            <QTooltip size="md">{{ t('account.projects.alerts.info') }}</QTooltip>
                        </p>
                        <template
                            v-for="alert in Object.entries(userSettingsAlertsFormatted)"
                            :key="alert[0]"
                        >
                            <AtomicToggle
                                v-model="userSettingsAlertsFormatted[alert[0] as AlertKey]"
                                :label="t(`project.settings.emailAlert.${alert[0]}`)"
                            />
                        </template>
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
h2
    font-size: 1.3rem

.project-name
    font-size: 1.3rem

.alertes-toggles
    display: flex
    flex-direction: column

.q-card
    min-width: 200px
    min-height: 400px
    display: flex
    flex-direction: column

    .q-spinner
        margin: auto

    .alert-title
        width: fit-content
</style>
