<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()
const projectStore = useProjectStore()
</script>

<template>
    <QForm>
        <AtomicInput
            v-model="projectStore.name"
            :label="t('newProject.steps.informations.name')"
            required
            :rules="[
                () => projectStore.nameRequired || t('forms.validation.fieldIsRequired'),
                () => projectStore.nameLengthValid || t('forms.validation.fieldLessThan255'),
            ]"
            type="text"
        />
        <AtomicInput
            v-model="projectStore.description"
            :label="t('newProject.steps.informations.description')"
            type="textarea"
        />
    </QForm>
</template>
