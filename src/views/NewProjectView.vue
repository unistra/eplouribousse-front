<script lang="ts" setup>
import ProjectStepper from '@/components/project/stepper/ProjectStepper.vue'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isRequirementValidated = ref<boolean>(false)
const store = useProjectStore()
store.$reset()
</script>

<template>
    <QPage padding>
        <div
            v-if="!isRequirementValidated"
            class="requirements"
        >
            <div>
                <h1>{{ t('view.project.new.stepper.requirements.heading') }}</h1>
                <p>{{ t('view.project.new.stepper.requirements.message') }}</p>
            </div>
            <ul>
                <li>{{ t('view.project.new.stepper.requirements.list.projectName') }}</li>
                <li>{{ t('view.project.new.stepper.requirements.list.managerEmails') }}</li>
                <li>{{ t('view.project.new.stepper.requirements.list.adminEmails') }}</li>
                <li>{{ t('view.project.new.stepper.requirements.list.controllerEmail') }}</li>
                <li>{{ t('view.project.new.stepper.requirements.list.libraryNames') }}</li>
                <li>{{ t('view.project.new.stepper.requirements.list.libraryRCRs') }}</li>
                <li>{{ t('view.project.new.stepper.requirements.list.libraryInstructorEmails') }}</li>
                <li>
                    {{ t('view.project.new.stepper.requirements.list.libraryCollections') }}
                    <ul>
                        <li>{{ t('view.project.new.stepper.requirements.list.collectionIdentified') }}</li>
                        <li>{{ t('view.project.new.stepper.requirements.list.additionalInfos') }}</li>
                    </ul>
                </li>
            </ul>
            <AtomicButton
                color="primary"
                :label="t('newProject.buttons.ready')"
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
