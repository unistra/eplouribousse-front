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
    <div
        v-if="projectStore.project"
        class="tabs"
    >
        <QChip
            v-for="exclusionReason in projectStore.project.settings.exclusionReasons"
            :key="exclusionReason"
            icon-remove="mdi-close"
            :label="exclusionReason"
            :removable="projectStore.userIsAdmin"
            size="1rem"
        />
    </div>
    <template v-if="projectStore.userIsAdmin">
        <AtomicButton
            v-if="!addingExclusionReason"
            icon="mdi-plus"
            :label="t('common.addMore')"
            no-border
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
    </template>
</template>
<style lang="sass" scoped>
.q-chip
    background-color: var(--color-white)
.tabs
    display: flex
    align-items: center
    flex-wrap: wrap
</style>
