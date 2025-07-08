<script lang="ts" setup>
import { QStepper } from 'quasar'
import { useI18n } from 'vue-i18n'
import NewProjectLibraries from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraries.vue'
import NewProjectInformations from '@/components/newProject/steps/newProjectInformations/NewProjectInformations.vue'
import { useNewProjectStepper } from '@/components/newProject/newProjectStepper/useNewProjectStepper.ts'
import NewProjectRoles from '@/components/newProject/steps/newProjectRoles/NewProjectRoles.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import NewProjectSummary from '@/components/newProject/steps/newProjectSummary/NewProjectSummary.vue'

const { t } = useI18n()

const { step, nextStep, previousStep, buttonLabel, passToReviewLoading, passToReview } = useNewProjectStepper()
</script>

<template>
    <QStepper
        ref="stepper"
        v-model="step"
        active-color="green"
        animated
        color="primary"
        flat
    >
        <QStep
            :done="step > 1"
            icon="settings"
            :name="1"
            :title="t('newProject.steps.informations.title')"
        >
            <NewProjectInformations />
        </QStep>

        <QStep
            :done="step > 2"
            icon="mdi-bookshelf"
            :name="2"
            :title="t('newProject.steps.libraries.title')"
        >
            <NewProjectLibraries />
        </QStep>

        <QStep
            :done="step > 3"
            icon="mdi-account"
            :name="3"
            :title="t('newProject.steps.roles.title')"
        >
            <NewProjectRoles />
        </QStep>

        <QStep
            :done="step > 4"
            icon="mdi-checkbox-multiple-marked"
            :name="4"
            :title="t('newProject.steps.summary.title')"
        >
            <NewProjectSummary />
        </QStep>

        <template #navigation>
            <QStepperNavigation>
                <AtomicButton
                    v-if="step > 1"
                    :label="t('newProject.steps.informations.back')"
                    @click="previousStep"
                />
                <AtomicButton
                    v-if="step === 4"
                    color="primary"
                    :label="t('newProject.buttons.passToReview')"
                    :loading="passToReviewLoading"
                    no-border
                    require-confirmation
                    @confirm="passToReview"
                >
                    <template #confirmation-content>
                        <QCardSection>
                            <p>{{ t('newProject.steps.summary.whenConfirm') }}</p>
                            <p>{{ t('confirmDialogDefault.areYouSure') }}</p>
                        </QCardSection>
                    </template>
                </AtomicButton>
                <AtomicButton
                    v-else
                    :label="buttonLabel"
                    @click="nextStep"
                />
            </QStepperNavigation>
        </template>
    </QStepper>
</template>

<style scoped></style>
