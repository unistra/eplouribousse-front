<script lang="ts" setup>
import ProjectStepper from '@/components/project/stepper/ProjectStepper.vue'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isRequirementValidated = ref<boolean>(false)
const projectStore = useProjectStore()
projectStore.project = undefined
</script>

<template>
    <QPage padding>
        <div
            v-if="!isRequirementValidated"
            class="requirements"
        >
            <div>
                <h1>{{ t('views.project.new.stepper.requirements.heading') }}</h1>
                <p>{{ t('views.project.new.stepper.requirements.message') }}</p>
            </div>
            <ul>
                <li>{{ t('views.project.new.stepper.requirements.list.projectName') }}</li>
                <li>{{ t('views.project.new.stepper.requirements.list.managerEmails', 2) }}</li>
                <li>{{ t('views.project.new.stepper.requirements.list.adminEmails', 2) }}</li>
                <li>{{ t('views.project.new.stepper.requirements.list.controllerEmail', 2) }}</li>
                <li>{{ t('views.project.new.stepper.requirements.list.libraryNames', 2) }}</li>
                <li>{{ t('views.project.new.stepper.requirements.list.libraryRCRs') }}</li>
                <li>{{ t('views.project.new.stepper.requirements.list.libraryInstructorEmails', 2) }}</li>
                <li>
                    {{ t('views.project.new.stepper.requirements.list.libraryCollections', 2) }}
                    <ul>
                        <li>{{ t('views.project.new.stepper.requirements.list.collectionIdentified') }}</li>
                        <li>{{ t('views.project.new.stepper.requirements.list.additionalInfos') }}</li>
                    </ul>
                </li>
            </ul>
            <AtomicButton
                color="primary"
                :label="t('views.project.new.button.ready')"
                no-border
                @click="isRequirementValidated = true"
            />
        </div>
        <ProjectStepper v-else />
    </QPage>
</template>

<style lang="sass" scoped>
.q-page
    display: flex

    .requirements
        width: 100%
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        gap: 1rem

        div
            display: flex
            flex-direction: column
            align-items: center
        p
            font-weight: bold
</style>
