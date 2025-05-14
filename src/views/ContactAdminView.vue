<script lang="ts" setup>
import type { SelectOption } from '#/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
    <main>
        <div class="container-center margin-b2">
            <h1>{{ t('contactAdmin.title') }}</h1>
        </div>
        <div class="row">
            <div class="col-4">
                <QForm @submit.prevent="submitEmailForm">
                    <QSelect
                        :label="t('contactAdmin.object')"
                        :options="objects_available"
                        emit-value
                        map-options
                        v-model="object"
                        outlined
                        required
                        style="padding-bottom: 2rem"
                    />
                    <QInput
                        :hint="t('contactAdmin.message')"
                        :label="t('contactAdmin.placeholder')"
                        :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
                        v-model="subject"
                        reactive-rules
                        counter
                        outlined
                        style="padding-bottom: 2rem"
                        type="textarea"
                    />
                    <QBtn
                        :label="t('contactAdmin.send')"
                        outline
                        type="submit"
                    />
                </QForm>
            </div>
        </div>
    </main>
</template>
