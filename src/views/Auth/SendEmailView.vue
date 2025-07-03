<script lang="ts" setup>
import SendEmailResetPasswordForm from '@/components/forms/auth/sendEmailResetPasswordForm/SendEmailResetPasswordForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QPage
        class="container column content-center"
        padding
    >
        <h1>{{ t('forms.password.reset.title') }}</h1>
        <SendEmailResetPasswordForm />
    </QPage>
</template>
