<script setup lang="ts">
import ChangePasswordForm from '@/components/forms/changePassword/ChangePasswordForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <main class="container-center">
        <h2>{{ t('forms.password.change.title') }}</h2>
        <ChangePasswordForm />
    </main>
</template>
