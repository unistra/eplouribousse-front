<script lang="ts" setup>
import type { SelectOption } from '#/utils'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'

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
    <div class="container column content-center">
        <h1>{{ t('contactAdmin.title') }}</h1>
        <QForm
            class="container column"
            @submit.prevent="submitEmailForm"
        >
            <AtomicSelect
                v-model="object"
                emit-value
                :label="t('contactAdmin.object')"
                map-options
                :options="objects_available"
                outlined
                required
                rounded
            />
            <AtomicInput
                v-model="subject"
                counter
                :hint="t('contactAdmin.message')"
                :label="t('contactAdmin.placeholder')"
                outlined
                reactive-rules
                :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
                type="textarea"
            />
            <div class="container justify-start">
                <AtomicButton
                    :label="t('contactAdmin.send')"
                    type="submit"
                />
            </div>
        </QForm>
    </div>
</template>
