<script setup lang="ts">
import ChangePasswordForm from '@/components/forms/auth/changePassword/ChangePasswordForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <main class="container column content-center">
        <h1>{{ t('forms.password.change.title') }}</h1>
        <ChangePasswordForm />
    </main>
</template>
