<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()
const store = useProjectStore()
</script>

<template>
    <QForm class="container column align-center">
        <AtomicInput
            v-model="store.name"
            :disable="!store.acl.update"
            :label="t('newProject.steps.informations.name')"
            required
            :rules="[
                () => store.nameRequired || t('forms.validation.fieldIsRequired'),
                () => store.nameLengthValid || t('forms.validation.fieldLessThan255'),
            ]"
            type="text"
        />
        <AtomicInput
            v-model="store.description"
            :disable="!store.acl.update"
            :label="t('newProject.steps.informations.description')"
            type="textarea"
        />
    </QForm>
</template>
