<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
    label: string
    model: string | number | undefined
    required?: boolean
    hint?: string
    type?: 'text' | 'textarea' | 'number' | 'date'
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
        :label
        :model-value="model"
        :readonly
        :disable
        :clearable
        :outlined
        :counter
        :hint="hint ?? ''"
        :style="`width: ${width ? width : '100%'}`"
        :rules="required ? [(val) => !!val || t('forms.fieldIsRequired')] : []"
        :type="type ?? 'text'"
        @update:model-value="emit('update:model', $event)"
        ><template
            v-if="icon"
            #before
        >
            <QIcon :name="icon" />
        </template>
    </QInput>
</template>
