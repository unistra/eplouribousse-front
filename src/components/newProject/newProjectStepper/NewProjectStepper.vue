<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import { QStepper } from 'quasar'
import { useI18n } from 'vue-i18n'
import NewProjectLibraries from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraries.vue'
import NewProjectInformations from '@/components/newProject/steps/newProjectInformations/NewProjectInformations.vue'
import NewProjectUsers from '../newProjectUsers/NewProjectUsers.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const step = ref(1)
const stepper = useTemplateRef<QStepper>('stepper')
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
            icon="assignment"
            :name="3"
            title="Ad template"
        >
            <NewProjectUsers />
        </QStep>

        <template #navigation>
            <QStepperNavigation>
                <div class="container">
                    <AtomicButton
                        :label="
                            step === 4
                                ? t('newProject.steps.informations.back')
                                : t('newProject.steps.informations.continue')
                        "
                        @click="stepper?.next"
                    />
                    <AtomicButton
                        v-if="step > 1"
                        :label="t('newProject.steps.informations.back')"
                        @click="stepper?.previous"
                    />
                </div>
            </QStepperNavigation>
        </template>
    </QStepper>
</template>

<style scoped></style>
