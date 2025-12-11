<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useLibraryDeleteBtn } from '@/components/library/libraryDeleteBtn/useLibraryDeleteBtn.ts'
import type { LibraryI } from '#/library.d.ts'
import { defineEmits, onMounted } from 'vue'

const props = defineProps<{
    libraryToDelete: LibraryI
}>()
const emit = defineEmits<{
    submitted: []
}>()

const { t } = useI18n()

const { dialog, onDeleteLibrary, library } = useLibraryDeleteBtn(emit)

onMounted(() => {
    library.value.id = props.libraryToDelete.id
    library.value.name = props.libraryToDelete.name
    library.value.alias = props.libraryToDelete.alias
    library.value.code = props.libraryToDelete.code
})
</script>

<template>
    <slot
        v-if="libraryToDelete && libraryToDelete.id"
        name="button"
        :openDialog="dialog.open"
    >
        <QBtn
            :icon="'mdi-delete'"
            :label="t('common.delete')"
            @click="dialog.open"
        />
    </slot>
    <QDialog v-model="dialog.value">
        <QCard>
            <QCardSection>
                <div class="text-h6">
                    {{ t('fn.library.form.delete.i') }}
                </div>
            </QCardSection>
            <QCardSection>
                <p>{{ t('fn.library.form.delete.youAreAboutToDelete') }}:</p>
                <p class="library-to-delete">
                    <span
                        >{{ t('common.name') }}: <strong>{{ props.libraryToDelete.name }}</strong></span
                    >
                    <span
                        >{{ t('fn.library.form.fields.alias') }}:
                        <strong>{{ props.libraryToDelete.alias }}</strong></span
                    >
                    <span
                        >{{ t('fn.library.form.fields.code') }}: <strong>{{ props.libraryToDelete.code }}</strong></span
                    >
                </p>
                <p>{{ t('fn.library.form.delete.thisActionCannotBeUndone') }}</p>
            </QCardSection>
            <QCardActions align="right">
                <QBtn @click="dialog.close">
                    {{ t('common.cancel') }}
                </QBtn>
                <QBtn
                    color="negative"
                    @click="onDeleteLibrary"
                >
                    {{ t('fn.library.form.delete.i') }}
                </QBtn>
            </QCardActions>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
.library-to-delete {
    display: flex;
    flex-direction: column;

    strong {
        font-weight: bold;
    }
}
</style>
