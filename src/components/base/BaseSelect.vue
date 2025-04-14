<script lang="ts" setup>
import type { SelectOption } from '#/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
    label?: string
    disable?: boolean
    model?: string | number | undefined
    options?: SelectOption[]
    outlined?: boolean
    required?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:model', value: string | number): void
}>()
</script>

<template>
    <QSelect
        :label
        :disable
        :outlined
        :options="options"
        :model-value="model"
        :rules="required ? [(val) => !!val || t('forms.fieldIsRequired')] : []"
        emit-value
        map-options
        reactive-rules
        @update:model-value="emit('update:model', $event)"
    />
</template>
