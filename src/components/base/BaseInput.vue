<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import type { QInput } from 'quasar'

const { t } = useI18n()

defineProps<{
    label: string
    model: string | number | undefined
    required?: boolean
    hint?: string
    type?: QInput['type']
    readonly?: boolean
    disable?: boolean
    clearable?: boolean
    outlined?: boolean
    counter?: boolean
    icon?: string
    width?: string
    autogrow?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:model', value: string | number | null): void
}>()
</script>

<template>
    <QInput
        :clearable
        :counter
        :disable
        :hint="hint ?? ''"
        :label
        :model-value="model"
        :outlined
        :readonly
        :rules="required ? [(val) => !!val || t('forms.fieldIsRequired')] : []"
        :style="width ?? '100%'"
        :type="type ?? 'text'"
        @update:model-value="emit('update:model', $event)"
    >
        <template
            v-if="icon"
            #before
        >
            <QIcon :name="icon" />
        </template>
    </QInput>
</template>
