<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InviteForm from '@/components/forms/invite/InviteForm.vue'
const { t } = useI18n()
</script>

<template>
    <main>
        <h1>{{ t('forms.invite.title') }}</h1>
        <InviteForm />
    </main>
</template>
