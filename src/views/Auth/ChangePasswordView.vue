<script lang="ts" setup>
import ChangePasswordForm from '@/components/forms/auth/changePassword/ChangePasswordForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QPage
        class="container column content-center"
        padding
    >
        <h1>{{ t('forms.password.change.title') }}</h1>
        <ChangePasswordForm />
    </QPage>
</template>
