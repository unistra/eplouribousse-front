<script setup lang="ts">
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const { tenantColor } = storeToRefs(userStore)
</script>

<template>
    <main>
        <h1 style="text-align: center">{{ t('newProject.requirements.title') }}</h1>
        <div class="row">
            <div class="col-4">
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
                    </li>
                    <ul>
                        <li>{{ t('newProject.csvFormat') }}</li>
                        <li>{{ t('newProject.additionalInfos') }}</li>
                    </ul>
                    <li>{{ t('newProject.storageNames') }}</li>
                    <li>{{ t('newProject.storageOperatorEmails') }}</li>
                </ul>
                <QSeparator />
                <p class="margin-t1 margin-b1">{{ t('newProject.searchUsers') }}</p>
                <SearchUser role="" />
            </div>
            <div class="col-3 table-center">
                <div class="table-cell-vertical-align">
                    <QBtn
                        text-color="white"
                        no-caps
                        :to="{ name: 'newProject' }"
                        :style="tenantColor"
                        >{{ t('newProject.requirements.requirementsOk') }}</QBtn
                    >
                </div>
            </div>
        </div>
    </main>
</template>
