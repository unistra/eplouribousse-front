<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthRequestPasswordReset } from './useAuthRequestPasswordReset.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const { email, isLoading, sendEmail } = useAuthRequestPasswordReset()
</script>

<template>
    <QForm
        class="auth-form"
        @submit.prevent="sendEmail"
    >
        <QInput
            v-model="email"
            autofocus
            :label="t('common.emailAddress')"
            reactive-rules
            :rules="[(val) => !!val || t('errors.form.fieldIsRequired')]"
            type="email"
        />
        <AtomicButton
            :label="t('views.auth.sendEmail')"
            :loading="isLoading"
            type="submit"
        />
    </QForm>
</template>
