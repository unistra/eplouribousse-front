<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLoginForm } from './useLoginForm.ts'
import OrDividerUtils from '@/components/utils/OrDividerUtils.vue'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import { onMounted, ref } from 'vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()
const { email, password, isLoading, onLogin } = useLoginForm()
const loginURL = ref<string>('')

onMounted(() => {
    loginURL.value = location.href.split('-pprd.app.unistra.fr')[0].concat('-api-pprd.app.unistra.fr/saml2/login/')
})
</script>

<template>
    <div class="container column medium">
        <AtomicButton
            :href="loginURL"
            :label="t('forms.login.renater')"
            no-caps
        />
    </div>

    <OrDividerUtils />

    <QForm
        @submit.prevent="onLogin"
        class="container column medium"
    >
        <AtomicInput
            :label="t('forms.login.email')"
            :rules="[(val: string) => !!val || t('forms.fieldIsRequired')]"
            :model="email"
            type="email"
            reactive-rules
            @update:model="email = $event as string"
        />
        <PasswordField
            v-model="password"
            :label="t('forms.login.password')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
        />
        <p>
            {{ t('forms.login.forgottenPassword') }} <a href="/send-email"> {{ t('forms.login.clickHere') }}</a>
        </p>

        <div class="container justify-center">
            <AtomicButton
                :loading="isLoading"
                :label="t('forms.login.submit')"
                no-caps
                type="submit"
            />
        </div>
    </QForm>
</template>
