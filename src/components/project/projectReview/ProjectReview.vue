<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import NewProjectSummary from '@/components/newProject/steps/newProjectSummary/NewProjectSummary.vue'
import ProjectSettings from '@/components/project/projectSettings/ProjectSettings.vue'
import { useProjectReview } from '@/components/project/projectReview/useProjectReview.ts'

const { t } = useI18n()
const store = useProjectStore()
const { settingsMode, dateModal, onConfirm, dateStringFR, date, todayStringEN } = useProjectReview()
</script>

<template>
    <div class="project-review">
        <hgroup>
            <template v-if="!settingsMode">
                <h2>{{ t('project.review.title') }}</h2>
                <AtomicButton
                    icon="mdi-cog"
                    no-border
                    @click="settingsMode = true"
                />
            </template>
            <template v-else>
                <h2>{{ t('project.settings.title') }}</h2>
                <AtomicButton
                    icon="mdi-close"
                    no-border
                    @click="settingsMode = false"
                />
            </template>
        </hgroup>

        <KeepAlive>
            <NewProjectSummary v-if="!settingsMode" />
            <ProjectSettings v-else />
        </KeepAlive>

        <AtomicButton
            v-if="store.status < 30"
            color="primary"
            confirm-button-color="primary"
            :label="t('project.review.passToReady')"
            no-border
            require-confirmation
            @confirm="store.passToReady"
        >
            <template #confirmation-content>
                <QCardSection>
                    <p>{{ t('project.review.confirmPassToReview') }}</p>
                    <p>{{ t('confirmDialogDefault.irreversible') }}</p>
                </QCardSection>
            </template>
        </AtomicButton>
        <AtomicButton
            v-else-if="store.status < 40"
            color="primary"
            :label="t('project.ready.startTheProject')"
            no-border
            @click="dateModal = true"
        />
        <QDialog
            v-model="dateModal"
            persistent
        >
            <QCard>
                <QCardSection>
                    <p>{{ t('project.ready.defineStartDate') }}</p>
                    <AtomicInput
                        v-model="date"
                        :min="todayStringEN"
                        outlined
                        rounded
                        type="date"
                        :value="todayStringEN"
                    >
                    </AtomicInput>
                </QCardSection>
                <QCardActions align="right">
                    <AtomicButton
                        :label="t('common.cancel')"
                        @click="dateModal = false"
                    />
                    <AtomicButton
                        color="primary"
                        confirm-button-color="primary"
                        :label="t('common.confirm')"
                        no-border
                        require-confirmation
                        @confirm="onConfirm"
                    >
                        <template #confirmation-content>
                            <QCardSection>
                                <p>
                                    {{ t('project.ready.confirmStart') }} <strong>{{ dateStringFR }}</strong>
                                </p>
                                <p>{{ t('confirmDialogDefault.irreversible') }}</p>
                            </QCardSection>
                        </template>
                    </AtomicButton>
                </QCardActions>
            </QCard>
        </QDialog>
    </div>
</template>

<style lang="sass" scoped>
.project-review
    display: flex
    flex-direction: column
    gap: 1rem
    width: 100%

    hgroup
        display: flex
        justify-content: space-between
        align-items: center
        h2
            font-size: var(--font-size-3xl)

    > .q-btn
        align-self: end

    .q-card__section
        strong
            font-weight: bold
</style>
