<script setup lang="ts">
import CreateAccountForm from '@/components/forms/auth/createAccount/CreateAccountForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <main class="container column content-center">
        <h1>{{ t('forms.createAccount.title') }}</h1>
        <CreateAccountForm />
    </main>
</template>
