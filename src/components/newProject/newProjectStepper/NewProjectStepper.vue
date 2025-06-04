<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import { QStepper } from 'quasar'
import { useI18n } from 'vue-i18n'
import NewProjectLibraries from '@/components/newProject/newProjectLibraries/NewProjectLibraries.vue'

const { t } = useI18n()
const step = ref(1)
const stepper = useTemplateRef<QStepper>('stepper')

const name = ref('')
const description = ref('')
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
            <QInput
                v-model="name"
                :label="t('newProject.steps.informations.name')"
                type="text"
            />
            <QInput
                v-model="description"
                :label="t('newProject.steps.informations.description')"
                type="textarea"
            />
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
            disable
            icon="assignment"
            :name="3"
            title="Ad template"
        >
            This step won't show up because it is disabled.
        </QStep>

        <QStep
            icon="add_comment"
            :name="4"
            title="Create an ad"
        >
            Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using
            features like ad extensions. If you run into any problems with your ads, find out how to tell if they're
            running and how to resolve approval issues.
        </QStep>

        <template v-slot:navigation>
            <QStepperNavigation>
                <QBtn
                    color="primary"
                    :label="step === 4 ? 'Finish' : 'Continue'"
                    @click="stepper?.next"
                />
                <QBtn
                    v-if="step > 1"
                    class="q-ml-sm"
                    color="primary"
                    flat
                    label="Back"
                    @click="stepper?.previous"
                />
            </QStepperNavigation>
        </template>
    </QStepper>
</template>

<style scoped></style>
