<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLoginForm } from './useLoginForm'
import OrDividerUtils from '@/components/utils/OrDividerUtils.vue'
import PasswordField from '@/components/utils/form/PasswordField.vue'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const { email, password, isLoading, onLogin } = useLoginForm()
const loginURL = ref<string>('')

onMounted(() => {
    loginURL.value = window.location.href.split('.app.unistra.fr')[0].concat('.app.unistra.fr/saml2/login/')
})
</script>

<template>
    <QBtn
        no-caps
        class="margin-t1"
        :href="loginURL"
        :label="t('forms.login.renater')"
    />

    <OrDividerUtils />

    <QForm @submit.prevent="onLogin">
        <QInput
            :label="t('forms.login.email')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            reactive-rules
            v-model="email"
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
            :loading="isLoading"
            no-caps
            type="submit"
            class="margin-t1"
        >
            {{ t('forms.login.submit') }}
        </QBtn>
    </QForm>
</template>
