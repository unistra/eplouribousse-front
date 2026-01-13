<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useLibraryCreateAndEditBtn } from '@/components/library/libraryCreateAndEditBtn/useLibraryCreateAndEditBtn.ts'
import type { LibraryI } from '#/library.d.ts'
import { onMounted } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const props = defineProps<{
    buttonLabel?: string
    buttonIcon?: string
    libraryToEdit?: LibraryI
}>()
const emit = defineEmits<{
    submitted: []
}>()

const { t } = useI18n()

const isToEdit = !!props.libraryToEdit
const { dialog, library, onSubmit, errors } = useLibraryCreateAndEditBtn(isToEdit, emit)

onMounted(() => {
    if (props.libraryToEdit && 'id' in library) {
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
        <AtomicButton
            :icon="buttonIcon || 'mdi-plus'"
            :label="buttonLabel || t('fn.library.form.add')"
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
                    {{ isToEdit ? t('fn.library.form.edit') : t('fn.library.form.add') }}
                </div>
            </QCardSection>

            <QForm @submit.prevent="onSubmit">
                <QCardSection>
                    <QInput
                        v-model="library.name"
                        autofocus
                        :error="!!errors.name"
                        :error-message="errors.name"
                        :label="t('common.name')"
                        :rules="[(val) => !!val || t('errors.form.fieldIsRequired')]"
                    />
                    <QInput
                        v-model="library.alias"
                        :error="!!errors.alias"
                        :error-message="errors.alias"
                        :label="t('fn.library.form.fields.alias')"
                        :rules="[(val) => !!val || t('errors.form.fieldIsRequired')]"
                    />
                    <QInput
                        v-model="library.code"
                        :error="!!errors.code"
                        :error-message="errors.code"
                        :label="t('fn.library.form.fields.code')"
                        :rules="[(val) => !!val || t('errors.form.fieldIsRequired')]"
                    />
                </QCardSection>

                <QCardActions
                    align="right"
                    class="text-primary"
                >
                    <QBtn
                        v-close-popup
                        flat
                        :label="t('common.cancel')"
                    />
                    <QBtn
                        flat
                        :label="isToEdit ? t('fn.library.form.edit') : t('fn.library.form.add')"
                        type="submit"
                    />
                </QCardActions>
            </QForm>
        </QCard>
    </QDialog>
</template>
