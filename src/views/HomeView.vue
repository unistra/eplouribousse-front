<script setup lang="ts">
import type { SelectOption } from '#/utils'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const opts: SelectOption[] = [
    {
        value: 'Test1',
        label: 'Test1',
    },
    {
        value: 'Test2',
        label: 'Test2',
    },
]
const test = ref<string>()
</script>

<template>
    {{ t('test') }}
    <br />
    <BaseButton
        label="TEST"
        outline
        @click="console.log('test')"
    />
</template>
