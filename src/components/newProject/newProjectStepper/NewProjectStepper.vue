<script lang="ts" setup>
import { QStepper } from 'quasar'
import { useI18n } from 'vue-i18n'
import NewProjectLibraries from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraries.vue'
import NewProjectInformations from '@/components/newProject/steps/newProjectInformations/NewProjectInformations.vue'
import { useNewProjectStepper } from '@/components/newProject/newProjectStepper/useNewProjectStepper.ts'
import NewProjectRoles from '@/components/newProject/steps/newProjectRoles/NewProjectRoles.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()

const { step, nextStep, previousStep, buttonLabel } = useNewProjectStepper()
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
            icon="mdi-account"
            :name="3"
            :title="t('newProject.steps.roles.title')"
        >
            <NewProjectRoles />
        </QStep>

        <template #navigation>
            <QStepperNavigation>
                <AtomicButton
                    :label="buttonLabel"
                    @click="nextStep"
                />
                <AtomicButton
                    v-if="step > 1"
                    :label="t('newProject.steps.informations.back')"
                    @click="previousStep"
                />
            </QStepperNavigation>
        </template>
    </QStepper>
</template>

<style scoped></style>
