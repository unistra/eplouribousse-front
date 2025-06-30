<script setup lang="ts">
import SendEmailResetPasswordForm from '@/components/forms/auth/sendEmailResetPasswordForm/SendEmailResetPasswordForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <main class="container column content-center">
        <h1>{{ t('forms.password.reset.title') }}</h1>
        <SendEmailResetPasswordForm />
    </main>
</template>
