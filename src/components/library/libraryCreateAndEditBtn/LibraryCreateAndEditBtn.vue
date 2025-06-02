<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLibraryCreateAndEditBtn } from '@/components/library/libraryCreateAndEditBtn/useLibraryCreateAndEditBtn.ts'
import type { Library } from '#/library.ts'
import { onMounted } from 'vue'

const props = defineProps<{
    buttonLabel?: string
    buttonIcon?: string
    libraryToEdit?: Library
}>()
const emit = defineEmits<{
    submitted: []
}>()

const { t } = useI18n()

const isToEdit = !!props.libraryToEdit
const { dialog, library, onSubmit, errors } = useLibraryCreateAndEditBtn(isToEdit, emit)

onMounted(() => {
    if (props.libraryToEdit) {
        library.id = props.libraryToEdit.id
        library.name = props.libraryToEdit.name
        library.alias = props.libraryToEdit.alias
        library.code = props.libraryToEdit.code
    }
})
</script>

<template>
    <slot
        name="button"
        :openDialog="dialog.open"
    >
        <QBtn
            :icon="buttonIcon || 'mdi-plus'"
            :label="buttonLabel || t('libraries.form.add')"
            @click="dialog.open"
        />
    </slot>
    <QDialog
        v-model="dialog.isOpen.value"
        persistent
    >
        <QCard>
            <QCardSection>
                <div class="text-h6">
                    {{ isToEdit ? t('libraries.form.edit') : t('libraries.form.add') }}
                    {{ t('libraries.form.aLibrary') }}
                </div>
            </QCardSection>

            <QForm @submit.prevent="onSubmit">
                <QCardSection>
                    <QInput
                        v-model="library.name"
                        autofocus
                        :error="!!errors.name"
                        :error-message="errors.name"
                        :label="t('libraries.form.fields.name')"
                        :rules="[(val) => !!val || t('forms.validation.fieldIsRequired')]"
                    />
                    <QInput
                        v-model="library.alias"
                        :error="!!errors.alias"
                        :error-message="errors.alias"
                        :label="t('libraries.form.fields.alias')"
                        :rules="[(val) => !!val || t('forms.validation.fieldIsRequired')]"
                    />
                    <QInput
                        v-model="library.code"
                        :error="!!errors.code"
                        :error-message="errors.code"
                        :label="t('libraries.form.fields.code')"
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
                        :label="t('libraries.form.cancel')"
                    />
                    <QBtn
                        flat
                        :label="isToEdit ? t('libraries.form.edit') : t('libraries.form.add')"
                        type="submit"
                    />
                </QCardActions>
            </QForm>
        </QCard>
    </QDialog>
</template>
