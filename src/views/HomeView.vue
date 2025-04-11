<script setup lang="ts">
import type { SelectOption } from '#/utils'
import BaseButton from '@/components/base/BaseButton.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const _opts: SelectOption[] = [
    {
        value: 'Test1',
        label: 'Test1',
    },
    {
        value: 'Test2',
        label: 'Test2',
    },
]
const _test = ref<string>()
</script>

<template>
    <div class="row">
        <div class="col-3">
            {{ t('test') }}
            <br />
            <BaseButton
                :label="t('homePage')"
                outline
                @click="console.log('test')"
            />
        </div>
    </div>
</template>
