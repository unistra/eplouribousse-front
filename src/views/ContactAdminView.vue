<script setup lang="ts">
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
        <h4>{{ t('contactAdmin.title') }}</h4>
    </div>
    <div class="row">
        <div class="col-4">
            <QForm @submit.prevent="submitEmailForm">
                <BaseSelect
                    outlined
                    :label="t('contactAdmin.object')"
                    :options="objects_available"
                    :model="object"
                    required
                    style="padding-bottom: 2rem"
                    @update:model="
                        (newObject) => {
                            object = newObject as string
                        }
                    "
                />
                <BaseInput
                    type="textarea"
                    counter
                    outlined
                    required
                    style="padding-bottom: 2rem"
                    :hint="t('contactAdmin.message')"
                    :model="subject"
                    :label="t('contactAdmin.placeholder')"
                    @update:model="
                        (newSubject) => {
                            subject = newSubject as string
                        }
                    "
                />
                <BaseButton
                    type="submit"
                    outline
                    no-caps
                    :label="t('contactAdmin.send')"
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
