<script setup lang="ts">
import ResetPasswordForm from '@/components/forms/resetPasswordForm/ResetPasswordForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <main class="container-center">
        <h1>{{ t('forms.password.reset.title') }}</h1>
        <ResetPasswordForm />
    </main>
</template>
