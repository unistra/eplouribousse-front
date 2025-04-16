<script lang="ts" setup>
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { SelectOption } from '#/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/components/base/BaseInput.vue'

const { t } = useI18n()

const objects_available: SelectOption[] = [
    { label: '1', value: 'v1' },
    { label: '2', value: 'v2' },
]
const object = ref<string>('')
const subject = ref<string>('')

function submitEmailForm() {
    console.log('formulaire envoyé')
}
</script>

<template>
    <div class="container-center vertical_space">
        <h1>{{ t('contactAdmin.title') }}</h1>
    </div>
    <div class="row">
        <div class="col-4">
            <QForm @submit.prevent="submitEmailForm">
                <BaseSelect
                    :label="t('contactAdmin.object')"
                    v-model="object"
                    :options="objects_available"
                    outlined
                    required
                    style="padding-bottom: 2rem"
                />
                <BaseInput
                    :hint="t('contactAdmin.message')"
                    :label="t('contactAdmin.placeholder')"
                    v-model="subject"
                    counter
                    outlined
                    required
                    style="padding-bottom: 2rem"
                    type="textarea"
                />
                <BaseButton
                    :label="t('contactAdmin.send')"
                    outline
                    type="submit"
                />
            </QForm>
        </div>
    </div>
</template>

<style>
.vertical_space {
    padding-bottom: 4rem;
}
</style>
