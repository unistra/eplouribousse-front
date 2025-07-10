<script lang="ts" setup>
import { QStepper } from 'quasar'
import { useI18n } from 'vue-i18n'
import NewProjectLibraries from '@/components/newProject/steps/newProjectLibraries/NewProjectLibraries.vue'
import NewProjectInformations from '@/components/newProject/steps/newProjectInformations/NewProjectInformations.vue'
import { useNewProjectStepper } from '@/components/newProject/newProjectStepper/useNewProjectStepper.ts'
import NewProjectRoles from '@/components/newProject/steps/newProjectRoles/NewProjectRoles.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import NewProjectSummary from '@/components/newProject/steps/newProjectSummary/NewProjectSummary.vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

const { t } = useI18n()

const { step, nextStep, previousStep, buttonLabel, passToReviewLoading, passToReview } = useNewProjectStepper()

onMounted(async () => {
    const route = useRoute()
    if (route.query.page && route.query.page === '2') await nextStep()
})
</script>

<template>
    <QStepper
        ref="stepper"
        v-model="step"
        active-color="primary"
        animated
        done-color="positive"
        flat
    >
        <QStep
            :done="step > 1"
            icon="mdi-information-slab-circle-outline"
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

<style lang="sass" scoped>
.q-stepper
    width: 100%
    display: flex
    flex-flow: column nowrap // Flex column to apply flex behavior on the parent

    ::v-deep(.q-stepper__content) // Apply style to nested, 'inaccessible' class
            flex-grow: 1 // Flex grow to make the element take all available height
            height: 0 // Set a smaller height than the actual height given by the flex-grow: 1
    // Thanks to flex behavior, height will be override by flex-grow 1
    // .q-stepper__content will keep his height unchanged whatever his content is (because a fixed height is set)
    // Children will be able to grow, and to be scrolled (without any overflow style change, but idk why maybe a browser feature or the default behavior of flex), without affecting parent.
    // Tested on chromium & firefox
    // This is a supposition of this css behavior, contact me if you have another supposition @max13h on gh

    .q-stepper__nav
        display: flex
        justify-content: end
        gap: 1rem
        margin-top: 1rem
</style>
