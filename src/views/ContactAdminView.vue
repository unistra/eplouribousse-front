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
        <h1 style="text-align: center">{{ t('contactAdmin.title') }}</h1>
        <div class="row">
            <div class="col-4">
                <QForm @submit.prevent="submitEmailForm">
                    <QSelect
                        v-model="object"
                        emit-value
                        :label="t('contactAdmin.object')"
                        map-options
                        :options="objects_available"
                        outlined
                        required
                        style="padding-bottom: 2rem"
                    />
                    <QInput
                        v-model="subject"
                        counter
                        :hint="t('contactAdmin.message')"
                        :label="t('contactAdmin.placeholder')"
                        outlined
                        reactive-rules
                        :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
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
        <div class="container row">
            <div
                class="container-item very-small"
                style="background-color: black"
            >
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
                <p style="color: white">Ceci est une longue chaine de caractère et c'est fait exprès</p>
            </div>
        </div>
    </main>
</template>
