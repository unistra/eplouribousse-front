<script lang="ts" setup>
import { QStepper } from 'quasar'
import { useI18n } from 'vue-i18n'
import { checkValidityProjectStepper, useProjectStepper } from '@/components/project/stepper/useProjectStepper'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import ProjectInformations from '@/components/project/stepper/steps/informations/ProjectInformations.vue'
import ProjectRoles from '@/components/project/stepper/steps/roles/ProjectRoles.vue'
import ProjectLibraries from '@/components/project/libraries/ProjectLibraries.vue'
import ProjectSummary from '@/components/project/stepper/steps/summary/ProjectSummary.vue'
import { useProjectStore } from '@/stores/projectStore.ts'

const { t } = useI18n()
const projectStore = useProjectStore()
const { step, nextStep, previousStep, buttonLabel, passToReviewLoading, passToReview } = useProjectStepper()

const { checkValidityForRolesStep, checkValidityForLibraryStep } = checkValidityProjectStepper()

const route = useRoute()
onMounted(async () => {
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
        error-color="negative"
        flat
        :header-nav="!!projectStore.project?.id"
    >
        <QStep
            :done="step > 1"
            icon="mdi-information-slab-circle-outline"
            :name="1"
            :title="t('view.project.new.stepper.steps.informations.tab')"
        >
            <ProjectInformations />
        </QStep>

        <QStep
            :done="step > 2"
            :error="step > 2 && !checkValidityForLibraryStep"
            icon="mdi-bookshelf"
            :name="2"
            :title="t('view.project.new.stepper.steps.libraries.tab')"
        >
            <ProjectLibraries />
        </QStep>

        <QStep
            :done="step > 3 && checkValidityForRolesStep"
            :error="step > 3 && !checkValidityForRolesStep"
            icon="mdi-account"
            :name="3"
            :title="t('view.project.new.stepper.steps.roles.tab')"
        >
            <ProjectRoles />
        </QStep>

        <QStep
            :done="step > 4"
            icon="mdi-checkbox-multiple-marked"
            :name="4"
            :title="t('view.project.new.stepper.steps.summary.tab')"
        >
            <ProjectSummary />
        </QStep>

        <template #navigation>
            <QStepperNavigation>
                <AtomicButton
                    v-if="step > 1"
                    :label="t('view.project.new.stepper.steps.informations.back')"
                    @click="previousStep"
                />
                <AtomicButton
                    v-if="step === 4"
                    color="primary"
                    :disable="!checkValidityForRolesStep || !checkValidityForLibraryStep"
                    :label="t('newProject.buttons.passToReview')"
                    :loading="passToReviewLoading"
                    no-border
                    require-confirmation
                    @confirm="passToReview"
                >
                    <template #confirmation-content>
                        <QCardSection class="confirmation-p">
                            <p>{{ t('view.project.new.stepper.steps.summary.whenConfirm') }}</p>
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

.confirmation-p
    display: flex
    flex-direction: column
    gap: 1rem
</style>
