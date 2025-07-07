<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const emit = defineEmits<{
    (e: 'validate'): void
}>()
</script>

<template>
    <div class="col-8">
        <p style="font-weight: bold">
            {{ t('newProject.requirements.message') }}
        </p>
        <ul class="margin-b1">
            <li>{{ t('newProject.projectName') }}</li>
            <li>{{ t('newProject.pilotEmails') }}</li>
            <li>{{ t('newProject.adminEmails') }}</li>
            <li>{{ t('newProject.controllerEmail') }}</li>
            <li>{{ t('newProject.libraryNames') }}</li>
            <li>{{ t('newProject.libraryRCRs') }}</li>
            <li>{{ t('newProject.libraryInstructorEmails') }}</li>
            <li>
                {{ t('newProject.libraryCollections') }}
                <span style="font-weight: bold"
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
        <!--        <QSeparator />-->
        <!--        <p class="margin-t1 margin-b1">{{ t('newProject.searchUsers') }}</p>-->
        <!--        <div class="container-center">-->
        <!--            <QBtn-->
        <!--                :label="t('newProject.requirements.invite')"-->
        <!--                :style="tenantColor"-->
        <!--                @click="open = true"-->
        <!--            />-->
        <!--        </div>-->
        <!--        <SearchUser role="" />-->
    </div>
    <div class="col-3 table-center">
        <div class="table-cell-vertical-align">
            <AtomicButton
                :label="t('newProject.buttons.ready')"
                @click="() => emit('validate')"
            >
                {{ t('newProject.requirements.requirementsOk') }}
            </AtomicButton>
        </div>
    </div>
    <!--    <QDialog v-model="open">-->
    <!--        <QCard-->
    <!--            bordered-->
    <!--            style="min-width: 24rem; min-height: 20rem"-->
    <!--        >-->
    <!--            <QCardSection style="display: flex; align-items: baseline">-->
    <!--                <h6>{{ t('newProject.requirements.inviteUser') }}</h6>-->
    <!--                <QSpace />-->
    <!--                <QBtn-->
    <!--                    v-close-popup-->
    <!--                    dense-->
    <!--                    flat-->
    <!--                    icon="mdi-close"-->
    <!--                    round-->
    <!--                />-->
    <!--            </QCardSection>-->

    <!--            <QSeparator />-->
    <!--            <QCardSection>-->
    <!--                <InviteForm />-->
    <!--            </QCardSection>-->
    <!--        </QCard>-->
    <!--    </QDialog>-->
</template>
