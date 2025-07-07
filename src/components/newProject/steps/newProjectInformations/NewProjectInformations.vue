<script lang="ts" setup>
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import type { QInput } from 'quasar'

const { t } = useI18n()
const store = useProjectStore()
</script>

<template>
    <QForm class="container column align-center">
        <QInput
            v-model="store.name"
            class="container-item"
            :label="t('newProject.steps.informations.name')"
            required
            :rules="[
                () => store.nameRequired || t('forms.validation.fieldIsRequired'),
                () => store.nameLengthValid || t('forms.validation.fieldLessThan255'),
            ]"
            type="text"
        />
        <QInput
            v-model="store.description"
            class="container-item"
            :label="t('newProject.steps.informations.description')"
            type="textarea"
        />
    </QForm>
</template>
