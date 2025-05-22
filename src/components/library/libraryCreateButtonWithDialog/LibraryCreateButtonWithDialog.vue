<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLibraryCreateButtonWithDialog } from '@/components/library/libraryCreateButtonWithDialog/useLibraryCreateButtonWithDialog.ts'

defineProps<{
    buttonLabel?: string
    buttonIcon?: string
}>()

const { t } = useI18n()

const { dialog, openDialog, library, createLibrary } = useLibraryCreateButtonWithDialog()
</script>

<template>
    <QBtn
        :icon="buttonIcon || 'mdi-plus'"
        :label="buttonLabel || t('libraries.add.title')"
        @click="openDialog"
    />
    <QDialog
        v-model="dialog"
        persistent
    >
        <QCard>
            <QCardSection>
                <div class="text-h6">{{ t('libraries.add.title') }}</div>
            </QCardSection>

            <QForm @submit.prevent="createLibrary">
                <QCardSection>
                    <QInput
                        v-model="library.name"
                        autofocus
                        :label="t('libraries.add.fields.name')"
                        :rules="[(val) => !!val || t('forms.validation.fieldIsRequired')]"
                    />
                    <QInput
                        v-model="library.alias"
                        :label="t('libraries.add.fields.alias')"
                        :rules="[(val) => !!val || t('forms.validation.fieldIsRequired')]"
                    />
                    <QInput
                        v-model="library.code"
                        :label="t('libraries.add.fields.code')"
                        :rules="[(val) => !!val || t('forms.validation.fieldIsRequired')]"
                    />
                </QCardSection>

                <QCardActions
                    align="right"
                    class="text-primary"
                >
                    <QBtn
                        v-close-popup
                        flat
                        :label="t('libraries.add.cancel')"
                    />
                    <QBtn
                        flat
                        :label="t('libraries.add.submit')"
                        type="submit"
                    />
                </QCardActions>
            </QForm>
        </QCard>
    </QDialog>
</template>
