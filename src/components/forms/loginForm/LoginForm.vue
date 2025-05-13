<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLoginForm } from './useLoginForm'
import OrDividerUtils from '@/components/utils/OrDividerUtils.vue'
import PasswordField from '@/components/utils/form/PasswordField.vue'

const { t } = useI18n()
const { email, password, isLoading, onLogin, loginViaShibbolet } = useLoginForm()
</script>

<template>
    <QBtn
        no-caps
        class="margin-top-8"
        @click="loginViaShibbolet"
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
            class="margin-top-8"
        >
            {{ t('forms.login.submit') }}
        </QBtn>
    </QForm>
</template>

<style scoped lang="scss">
.margin-top-8 {
    margin-top: 8px; /* To not overlap with the input error message (absolute) */
}
</style>
