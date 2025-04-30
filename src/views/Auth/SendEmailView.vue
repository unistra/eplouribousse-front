<script setup lang="ts">
import SendEmailForm from '@/components/forms/sendEmailForm/SendEmailForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <main class="container-center">
        <h2>{{ t('forms.resetPassword.title') }}</h2>
        <SendEmailForm />
    </main>
</template>
