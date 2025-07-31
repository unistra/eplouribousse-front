<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const emit = defineEmits<{
    (e: 'validate'): void
}>()
</script>

<template>
    <div class="requirements">
        <p class="bold">
            {{ t('newProject.requirements.message') }}
        </p>
        <ul>
            <li>{{ t('newProject.projectName') }}</li>
            <li>{{ t('newProject.pilotEmails') }}</li>
            <li>{{ t('newProject.adminEmails') }}</li>
            <li>{{ t('newProject.controllerEmail') }}</li>
            <li>{{ t('newProject.libraryNames') }}</li>
            <li>{{ t('newProject.libraryRCRs') }}</li>
            <li>{{ t('newProject.libraryInstructorEmails') }}</li>
            <li>
                {{ t('newProject.libraryCollections') }}
                <span class="bold"
                    >(*) <QTooltip>{{ t('newProject.libraryResourceTooltip') }}</QTooltip></span
                >
                <ul>
                    <li>{{ t('newProject.csvFormat') }}</li>
                    <li>{{ t('newProject.additionalInfos') }}</li>
                </ul>
            </li>

            <li>{{ t('newProject.storageNames') }}</li>
            <li>{{ t('newProject.storageOperatorEmails') }}</li>
        </ul>
        <AtomicButton
            color="primary"
            :label="t('newProject.buttons.ready')"
            no-border
            @click="() => emit('validate')"
        >
            {{ t('newProject.requirements.requirementsOk') }}
        </AtomicButton>
    </div>
</template>

<style lang="sass" scoped>
.requirements
    width: 100%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
.bold
    font-weight: bold
</style>
