<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLoginForm } from './useLoginForm.ts'
import OrDividerUtils from '@/components/utils/OrDividerUtils.vue'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const { email, password, isLoading, onLogin } = useLoginForm()
const loginURL = ref<string>('')

onMounted(() => {
    loginURL.value = location.href.split('-pprd.app.unistra.fr')[0].concat('-api-pprd.app.unistra.fr/saml2/login/')
})
</script>

<template>
    <QBtn
        class="margin-t1"
        :href="loginURL"
        :label="t('forms.login.renater')"
        no-caps
    />

    <OrDividerUtils />

    <QForm @submit.prevent="onLogin">
        <QInput
            v-model="email"
            :label="t('forms.login.email')"
            reactive-rules
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            type="email"
        />

        <PasswordField
            v-model="password"
            :label="t('forms.login.password')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
        />
        <p>
            {{ t('forms.login.forgottenPassword') }} <a href="/send-email"> {{ t('forms.login.clickHere') }}</a>
        </p>
        <QBtn
            class="margin-t1"
            :loading="isLoading"
            no-caps
            type="submit"
        >
            {{ t('forms.login.submit') }}
        </QBtn>
    </QForm>
</template>
