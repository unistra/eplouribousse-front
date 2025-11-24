<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { useProjectAdminTabExclusions } from '@/components/project/admin/tabs/exclusions/useProjectAdminTabExclusions.ts'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'

const projectStore = useProjectStore()
const { addingExclusionReason, newExclusionReason, onAddExclusionReason, onCancelAddExclusionReason } =
    useProjectAdminTabExclusions()
const { t } = useI18n()
</script>

<template>
    <QList>
        <QItem
            v-for="exclusionReason in projectStore.settings.exclusionReasons"
            :key="exclusionReason"
        >
            <p>{{ exclusionReason }}</p>
            <AtomicButton
                icon="mdi-close"
                no-border
                size="xs"
                @click="projectStore.removeExclusionReason(exclusionReason)"
            />
        </QItem>
        <QItem>
            <AtomicButton
                v-if="!addingExclusionReason"
                icon="mdi-plus"
                size="xs"
                @click="addingExclusionReason = true"
            />
            <AtomicInput
                v-else
                v-model="newExclusionReason"
                :label="t('project.settings.exclusionReason')"
                quick-input
                @cancel="onCancelAddExclusionReason"
                @done="onAddExclusionReason"
            />
        </QItem>
    </QList>
</template>
