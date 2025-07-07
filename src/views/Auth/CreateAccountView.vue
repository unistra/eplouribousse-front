<script lang="ts" setup>
import CreateAccountForm from '@/components/forms/auth/createAccount/CreateAccountForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QPage
        class="container column content-center"
        padding
    >
        <h1>{{ t('forms.createAccount.title') }}</h1>
        <CreateAccountForm />
    </QPage>
</template>
