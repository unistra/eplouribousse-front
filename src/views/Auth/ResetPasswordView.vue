<script lang="ts" setup>
import ResetPasswordForm from '@/components/forms/auth/resetPasswordForm/ResetPasswordForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QPage
        class="container column content-center"
        padding
    >
        <h1>{{ t('forms.password.reset.i') }}</h1>
        <ResetPasswordForm />
    </QPage>
</template>
